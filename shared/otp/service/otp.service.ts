import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import jsSHA from 'jssha';
import { OTPRepository } from '../../../shared/database/repositories/otp/otp.repository';
import { UserRepository } from '../../../shared/database/repositories/user/user.repository';
import { CreateOtpRequest } from '../dtos/CreateOtpRequest.dto';
import { OtpResult } from '../dtos/OtpResult.dto';
import * as bcrypt from 'bcrypt';
import { $Enums, OtpStatus, OtpType, Prisma } from '@prisma/client';
import { VerifyOtpRequest } from '../dtos/VerifyOtpRequest.dto';
import { InviteRepository } from '../../database/repositories/invite/invite-repository';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepository: OTPRepository,
    private readonly userRepository: UserRepository,
    private readonly inviteRepository: InviteRepository,
  ) {}

  async createOtp(request: CreateOtpRequest): Promise<OtpResult> {
    try {
      if (
        (!request.userId && !request.inviteId) ||
        (request.userId && request.inviteId)
      ) {
        throw new BadRequestException(
          'Either userId or inviteId must be provided, but not both',
        );
      }

      let targetEntity: {
        id: number;
        email: string | null;
        phone: string | null;
      } | null = null;
      let entityType: 'user' | 'invite' = 'user';

      if (request.userId) {
        targetEntity = await this.userRepository.getUserById({
          where: { id: request.userId },
          select: { id: true, email: true, phone: true },
        });
        entityType = 'user';

        if (!targetEntity) {
          throw new NotFoundException('User not found');
        }
      } else if (request.inviteId) {
        const invite = await this.inviteRepository.getInviteById({
          where: { id: request.inviteId },
          select: { id: true, invitedEmail: true },
        });
        entityType = 'invite';

        if (!invite) {
          throw new NotFoundException('Invite not found');
        }

        // For invites, we only have email
        targetEntity = {
          id: invite.id,
          email: invite.invitedEmail,
          phone: null,
        };
      }

      this.validateDeliveryMethod(request.deliveryMethod, targetEntity!);

      // Check rate limits
      const canCreateOtp =
        entityType === 'user'
          ? await this.otpRepository.validateOTPRateLimit(
              request.userId!,
              request.otpType,
              Number(process.env.OTP_MAX_ATTEMPT),
              Number(process.env.OTP_DEFAULT_EXPIRATION),
            )
          : await this.otpRepository.validateInviteOTPRateLimit(
              request.inviteId!,
              request.otpType,
              Number(process.env.OTP_MAX_ATTEMPT),
              Number(process.env.OTP_DEFAULT_EXPIRATION),
            );

      if (!canCreateOtp) {
        throw new BadRequestException(
          'Too many OTP requests. Please wait before requesting a new OTP',
        );
      }

      if (entityType === 'user') {
        await this.otpRepository.revokeUserOTPs(
          request.userId!,
          request.otpType,
        );
      } else {
        await this.otpRepository.revokeInviteOTPs(
          request.inviteId!,
          request.otpType,
        );
      }

      const otpSecret = this.generateOtpSecret(
        targetEntity!.id,
        request.otpType,
        entityType,
      );
      const otpCode = this.GenerateOTP(otpSecret);
      const hashedOtp = await bcrypt.hash(otpCode, 10);

      const expiresAt = new Date();
      expiresAt.setMinutes(
        expiresAt.getMinutes() + Number(process.env.OTP_DEFAULT_EXPIRATION),
      );

      const otpData: any = {
        otpType: request.otpType,
        otpCode: otpCode.toString(),
        otpSecret,
        hashedOtp,
        deliveryMethod: request.deliveryMethod,
        expiresAt,
        ipAddress: request.ipAddress,
        userAgent: request.userAgent,
      };

      if (entityType === 'user') {
        otpData.user = { connect: { id: request.userId } };
      } else {
        otpData.invite = { connect: { id: request.inviteId } };
      }

      const otpRecord = await this.otpRepository.createOTP({
        data: otpData as Prisma.OTPCreateInput,
      });

      return {
        success: true,
        message: 'OTP created successfully',
        otpId: otpRecord.publicId,
        expiresAt,
        otpCode: otpRecord.otpCode,
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to create OTP',
      );
    }
  }

  async verifyOtp(request: VerifyOtpRequest): Promise<OtpResult> {
    try {
      if (
        (!request.userId && !request.inviteId) ||
        (request.userId && request.inviteId)
      ) {
        throw new BadRequestException(
          'Either userId or inviteId must be provided, but not both',
        );
      }

      let otpRecord: {
        publicId: string;
        status: $Enums.OtpStatus;
        createdAt: Date;
        expiresAt: Date;
        revokedAt: Date | null;
        Id: number;
        userId: number | null;
        inviteId: number | null;
        otpType: $Enums.OtpType;
        otpCode: string;
        otpSecret: string;
        hashedOtp: string | null;
        deliveryMethod: $Enums.OtpDeliveryMethod;
        verifiedAt: Date | null;
        attemptedCount: number;
        maxAttempts: number;
        ipAddress: string | null;
        userAgent: string | null;
      } | null;

      if (request.userId) {
        otpRecord = await this.otpRepository.getActiveOTPByUserAndType(
          request.userId,
          request.otpType,
        );
      } else {
        otpRecord = await this.otpRepository.getActiveOTPByInviteAndType(
          request.inviteId!,
          request.otpType,
        );
      }

      if (!otpRecord) {
        return {
          success: false,
          message:
            'No valid OTP found or OTP is expired. Please request a new OTP.',
          otpId: '',
        };
      }

      if (new Date() > otpRecord.expiresAt) {
        await this.otpRepository.markOTPAsExpired(otpRecord.Id);
        return {
          success: false,
          message: 'OTP has expired. Please request a new OTP.',
          otpId: otpRecord.publicId,
        };
      }

      if (otpRecord.attemptedCount >= otpRecord.maxAttempts) {
        await this.otpRepository.markOTPAsFailed(otpRecord.Id);
        return {
          success: false,
          message:
            'Maximum verification attempts exceeded. Please request a new OTP.',
          otpId: otpRecord.publicId,
        };
      }

      await this.otpRepository.incrementAttemptCount(otpRecord.Id);

      const isValidHash = await bcrypt.compare(
        request.otpCode,
        otpRecord.hashedOtp || '',
      );
      const isValidSecret = this.ValidateOTP(
        otpRecord.otpSecret,
        parseInt(request.otpCode),
      );

      if (isValidHash && isValidSecret) {
        await this.otpRepository.markOTPAsVerified(otpRecord.Id);

        return {
          success: true,
          message: 'OTP verified successfully',
          otpId: otpRecord.publicId,
        };
      } else {
        const attemptsRemaining =
          otpRecord.maxAttempts - (otpRecord.attemptedCount + 1);

        if (attemptsRemaining <= 0) {
          await this.otpRepository.markOTPAsFailed(otpRecord.Id);
        }

        return {
          success: false,
          message: 'Invalid OTP code',
          otpId: otpRecord.publicId,
          attemptsRemaining: Math.max(0, attemptsRemaining),
        };
      }
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to verify OTP',
      );
    }
  }

  async revokeOtp(otpId: string): Promise<OtpResult> {
    try {
      const otpRecord = await this.otpRepository.getOTPByPublicId(otpId);

      if (!otpRecord) {
        throw new NotFoundException('OTP not found');
      }

      if (otpRecord.status !== OtpStatus.PENDING) {
        return {
          success: false,
          message: `OTP is already ${otpRecord.status.toLowerCase()}`,
          otpId,
        };
      }

      await this.otpRepository.revokeOTP(otpRecord.Id);

      return {
        success: true,
        message: 'OTP revoked successfully',
        otpId,
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to revoke OTP',
      );
    }
  }

  async revokeUserOtps(
    userId: number,
    otpType?: OtpType,
  ): Promise<{ revokedCount: number }> {
    try {
      const result = await this.otpRepository.revokeUserOTPs(userId, otpType);
      return { revokedCount: result.count };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to revoke user OTPs',
      );
    }
  }

  async revokeInviteOtps(
    inviteId: number,
    otpType?: OtpType,
  ): Promise<{ revokedCount: number }> {
    try {
      const result = await this.otpRepository.revokeInviteOTPs(
        inviteId,
        otpType,
      );
      return { revokedCount: result.count };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to revoke invite OTPs',
      );
    }
  }

  async getOtpStatus(otpId: string): Promise<{
    status: OtpStatus;
    expiresAt: Date;
    attemptsRemaining: number;
    createdAt: Date;
    entityType: 'user' | 'invite';
    entityId: number;
  }> {
    const otpRecord = await this.otpRepository.getOTPByPublicId(otpId);

    if (!otpRecord) {
      throw new NotFoundException('OTP not found');
    }

    const entityType = otpRecord.userId ? 'user' : 'invite';
    const entityId = otpRecord.userId || otpRecord.inviteId!;

    return {
      status: otpRecord.status,
      expiresAt: otpRecord.expiresAt,
      attemptsRemaining: Math.max(
        0,
        otpRecord.maxAttempts - otpRecord.attemptedCount,
      ),
      createdAt: otpRecord.createdAt,
      entityType,
      entityId,
    };
  }

  async cleanupExpiredOtps(): Promise<{ expiredCount: number }> {
    try {
      const result = await this.otpRepository.cleanupExpiredOTPs();
      return { expiredCount: result.count };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to cleanup expired OTPs',
      );
    }
  }

  GenerateOTP(otpSecret: string): string {
    const shaObject = new jsSHA('SHA-256', 'TEXT');
    shaObject.update(otpSecret);
    const shaObjectHexadecimal = shaObject.getHash('HEX');
    const hashNumber = parseInt(shaObjectHexadecimal, 16);
    const otpLength = Number(process.env.OTP_LENGTH);
    const otp = hashNumber % Math.pow(10, otpLength);
    return otp.toString().padStart(otpLength, '0');
  }

  ValidateOTP(otpSecret: string, submittedOTP: number): boolean {
    return Number(this.GenerateOTP(otpSecret)) === submittedOTP;
  }

  private generateOtpSecret(
    entityId: number,
    otpType: OtpType,
    entityType: 'user' | 'invite',
  ): string {
    const baseSecret = String(process.env.OTP_SECRET);
    const timestamp = Date.now();

    return `${baseSecret}-${entityType}-${entityId}-${otpType}-${timestamp}`;
  }

  private validateDeliveryMethod(
    deliveryMethod: any,
    entity: { email: string | null; phone: string | null },
  ): void {
    switch (deliveryMethod) {
      case 'SMS':
        if (!entity.phone) {
          throw new BadRequestException(
            'No phone number available for SMS delivery',
          );
        }
        break;
      case 'EMAIL':
        if (!entity.email) {
          throw new BadRequestException(
            'No email address available for email delivery',
          );
        }
        break;
      case 'BOTH':
        if (!entity.email || !entity.phone) {
          throw new BadRequestException(
            'Both email and phone must be available for dual delivery',
          );
        }
        break;
      default:
        throw new BadRequestException('Invalid delivery method');
    }
  }

  async hasValidUserOtp(userId: number, otpType: OtpType): Promise<boolean> {
    const otpRecord = await this.otpRepository.getActiveOTPByUserAndType(
      userId,
      otpType,
    );
    return otpRecord !== null && new Date() <= otpRecord.expiresAt;
  }

  async hasValidInviteOtp(
    inviteId: number,
    otpType: OtpType,
  ): Promise<boolean> {
    const otpRecord = await this.otpRepository.getActiveOTPByInviteAndType(
      inviteId,
      otpType,
    );
    return otpRecord !== null && new Date() <= otpRecord.expiresAt;
  }

  async getRecentUserOtpAttempts(
    userId: number,
    otpType: OtpType,
  ): Promise<number> {
    return this.otpRepository.getRecentOTPAttempts(
      userId,
      otpType,
      Number(process.env.OTP_DEFAULT_EXPIRATION),
    );
  }

  async getRecentInviteOtpAttempts(
    inviteId: number,
    otpType: OtpType,
  ): Promise<number> {
    return this.otpRepository.getRecentInviteOTPAttempts(
      inviteId,
      otpType,
      Number(process.env.OTP_DEFAULT_EXPIRATION),
    );
  }

  async canRequestNewUserOtp(
    userId: number,
    otpType: OtpType,
  ): Promise<{
    canRequest: boolean;
    message: string;
    waitTime?: number;
  }> {
    const recentAttempts = await this.getRecentUserOtpAttempts(userId, otpType);

    if (recentAttempts >= Number(process.env.OTP_MAX_ATTEMPTS)) {
      return {
        canRequest: false,
        message:
          'Too many OTP requests. Please wait before requesting a new OTP.',
        waitTime: Number(process.env.OTP_DEFAULT_EXPIRATION),
      };
    }

    const hasValid = await this.hasValidUserOtp(userId, otpType);
    if (hasValid) {
      return {
        canRequest: false,
        message:
          'A valid OTP already exists. Please use the existing OTP or wait for it to expire.',
      };
    }

    return {
      canRequest: true,
      message: 'You can request a new OTP.',
    };
  }

  async canRequestNewInviteOtp(
    inviteId: number,
    otpType: OtpType,
  ): Promise<{
    canRequest: boolean;
    message: string;
    waitTime?: number;
  }> {
    const recentAttempts = await this.getRecentInviteOtpAttempts(
      inviteId,
      otpType,
    );

    if (recentAttempts >= Number(process.env.OTP_MAX_ATTEMPTS)) {
      return {
        canRequest: false,
        message:
          'Too many OTP requests. Please wait before requesting a new OTP.',
        waitTime: Number(process.env.OTP_DEFAULT_EXPIRATION),
      };
    }

    const hasValid = await this.hasValidInviteOtp(inviteId, otpType);
    if (hasValid) {
      return {
        canRequest: false,
        message:
          'A valid OTP already exists. Please use the existing OTP or wait for it to expire.',
      };
    }

    return {
      canRequest: true,
      message: 'You can request a new OTP.',
    };
  }

  async requestNewOtp(request: CreateOtpRequest): Promise<OtpResult> {
    try {
      let canRequestResult;

      if (request.userId) {
        canRequestResult = await this.canRequestNewUserOtp(
          request.userId,
          request.otpType,
        );
      } else if (request.inviteId) {
        canRequestResult = await this.canRequestNewInviteOtp(
          request.inviteId,
          request.otpType,
        );
      } else {
        throw new BadRequestException(
          'Either userId or inviteId must be provided',
        );
      }

      if (!canRequestResult.canRequest) {
        let activeOtp;

        if (request.userId) {
          activeOtp = await this.otpRepository.getActiveOTPByUserAndType(
            request.userId,
            request.otpType,
          );
        } else {
          activeOtp = await this.otpRepository.getActiveOTPByInviteAndType(
            request.inviteId!,
            request.otpType,
          );
        }

        if (activeOtp && new Date() <= activeOtp.expiresAt) {
          return {
            success: true,
            message: String(canRequestResult.message),
            otpId: String(activeOtp.publicId),
            expiresAt: new Date(activeOtp.expiresAt as Date),
            otpCode: String(activeOtp.otpCode),
          };
        }

        return {
          success: false,
          message: String(canRequestResult.message),
          otpId: '',
          waitTime: Number(canRequestResult.waitTime),
        };
      }

      return await this.createOtp(request);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to request OTP',
      );
    }
  }
}
