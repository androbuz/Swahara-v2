import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../service/database.service';
import { OTP, OtpStatus, OtpType, Prisma } from '@prisma/client';

@Injectable()
export class OTPRepository {
  constructor(private db: DatabaseService) {}

  async getAllOTPs(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OTPWhereUniqueInput;
    where?: Prisma.OTPWhereInput;
    orderBy?: Prisma.OTPOrderByWithRelationInput;
    select?: Prisma.OTPSelect;
  }): Promise<OTP[]> {
    const { skip, take, cursor, where, orderBy, select } = params;

    return this.db.oTP.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async createOTP(params: {
    data: Prisma.OTPCreateInput;
    select?: Prisma.OTPSelect;
  }): Promise<OTP> {
    const { data, select } = params;
    return this.db.oTP.create({ data, select });
  }

  async updateOTP(params: {
    where: Prisma.OTPWhereUniqueInput;
    data: Prisma.OTPUpdateInput;
    select?: Prisma.OTPSelect;
  }): Promise<OTP> {
    const { where, data, select } = params;
    return this.db.oTP.update({ where, data, select });
  }

  async deleteOTP(params: { where: Prisma.OTPWhereUniqueInput }): Promise<OTP> {
    const { where } = params;
    return this.db.oTP.delete({ where });
  }

  async getOTPById(params: {
    where: Prisma.OTPWhereInput;
    select?: Prisma.OTPSelect;
  }): Promise<OTP | null> {
    const { where, select } = params;
    return this.db.oTP.findFirst({ where, select });
  }

  async getOTPByPublicId(publicId: string): Promise<OTP | null> {
    return this.db.oTP.findUnique({
      where: { publicId },
      include: {
        user: true,
        invite: true,
      },
    });
  }

  async getOTPsByUserId(userId: number): Promise<OTP[]> {
    return this.db.oTP.findMany({
      where: {
        userId,
        inviteId: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOTPsByInviteId(inviteId: number): Promise<OTP[]> {
    return this.db.oTP.findMany({
      where: {
        inviteId,
        userId: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getActiveOTPByUserAndType(
    userId: number,
    otpType: OtpType,
  ): Promise<OTP | null> {
    return this.db.oTP.findFirst({
      where: {
        userId,
        inviteId: null,
        otpType,
        status: OtpStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getActiveOTPByInviteAndType(
    inviteId: number,
    otpType: OtpType,
  ): Promise<OTP | null> {
    return this.db.oTP.findFirst({
      where: {
        inviteId,
        userId: null,
        otpType,
        status: OtpStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPendingOTPs(): Promise<OTP[]> {
    return this.db.oTP.findMany({
      where: {
        status: OtpStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: true,
        invite: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getExpiredOTPs(): Promise<OTP[]> {
    return this.db.oTP.findMany({
      where: {
        status: OtpStatus.PENDING,
        expiresAt: { lte: new Date() },
      },
      include: {
        user: true,
        invite: true,
      },
      orderBy: { expiresAt: 'asc' },
    });
  }

  async getFailedOTPs(limit = 50): Promise<OTP[]> {
    return this.db.oTP.findMany({
      where: {
        status: OtpStatus.FAILED,
        attemptedCount: { gte: 3 },
      },
      include: {
        user: true,
        invite: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async countOTPs(params?: { where?: Prisma.OTPWhereInput }): Promise<number> {
    return this.db.oTP.count(params);
  }

  async incrementAttemptCount(otpId: number): Promise<OTP> {
    return this.db.oTP.update({
      where: { Id: otpId },
      data: {
        attemptedCount: { increment: 1 },
      },
    });
  }

  async markOTPAsVerified(otpId: number): Promise<OTP> {
    return this.db.oTP.update({
      where: { Id: otpId },
      data: {
        status: OtpStatus.VERIFIED,
        verifiedAt: new Date(),
      },
    });
  }

  async markOTPAsExpired(otpId: number): Promise<OTP> {
    return this.db.oTP.update({
      where: { Id: otpId },
      data: {
        status: OtpStatus.EXPIRED,
      },
    });
  }

  async markOTPAsFailed(otpId: number): Promise<OTP> {
    return this.db.oTP.update({
      where: { Id: otpId },
      data: {
        status: OtpStatus.FAILED,
      },
    });
  }

  async revokeOTP(otpId: number): Promise<OTP> {
    return this.db.oTP.update({
      where: { Id: otpId },
      data: {
        status: OtpStatus.REVOKED,
        revokedAt: new Date(),
      },
    });
  }

  async revokeUserOTPs(
    userId: number,
    otpType?: OtpType,
  ): Promise<Prisma.BatchPayload> {
    const whereClause: Prisma.OTPWhereInput = {
      userId,
      inviteId: null,
      status: OtpStatus.PENDING,
    };

    if (otpType) {
      whereClause.otpType = otpType;
    }

    return this.db.oTP.updateMany({
      where: whereClause,
      data: {
        status: OtpStatus.REVOKED,
        revokedAt: new Date(),
      },
    });
  }

  async revokeInviteOTPs(
    inviteId: number,
    otpType?: OtpType,
  ): Promise<Prisma.BatchPayload> {
    const whereClause: Prisma.OTPWhereInput = {
      inviteId,
      userId: null,
      status: OtpStatus.PENDING,
    };

    if (otpType) {
      whereClause.otpType = otpType;
    }

    return this.db.oTP.updateMany({
      where: whereClause,
      data: {
        status: OtpStatus.REVOKED,
        revokedAt: new Date(),
      },
    });
  }

  async cleanupExpiredOTPs(): Promise<Prisma.BatchPayload> {
    return this.db.oTP.updateMany({
      where: {
        status: OtpStatus.PENDING,
        expiresAt: { lte: new Date() },
      },
      data: {
        status: OtpStatus.EXPIRED,
      },
    });
  }

  async getOTPStats(startDate?: Date, endDate?: Date) {
    const whereClause: Prisma.OTPWhereInput = {};

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = startDate;
      if (endDate) whereClause.createdAt.lte = endDate;
    }

    const stats = await this.db.oTP.groupBy({
      by: ['otpType', 'status'],
      where: whereClause,
      _count: { Id: true },
    });

    return stats.reduce(
      (acc, stat) => {
        if (!acc[stat.otpType]) {
          acc[stat.otpType] = {};
        }
        acc[stat.otpType][stat.status] = stat._count.Id;
        return acc;
      },
      {} as Record<string, Record<string, number>>,
    );
  }

  async getOTPsByDateRange(startDate: Date, endDate: Date): Promise<OTP[]> {
    return this.db.oTP.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: true,
        invite: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOTPsByIpAddress(ipAddress: string): Promise<OTP[]> {
    return this.db.oTP.findMany({
      where: { ipAddress },
      include: {
        user: true,
        invite: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRecentOTPAttempts(
    userId: number,
    otpType: OtpType,
    minutes = 5,
  ): Promise<number> {
    const timeThreshold = new Date();
    timeThreshold.setMinutes(timeThreshold.getMinutes() - minutes);

    return this.db.oTP.count({
      where: {
        userId,
        inviteId: null,
        otpType,
        createdAt: { gte: timeThreshold },
      },
    });
  }

  async getRecentInviteOTPAttempts(
    inviteId: number,
    otpType: OtpType,
    minutes = 5,
  ): Promise<number> {
    const timeThreshold = new Date();
    timeThreshold.setMinutes(timeThreshold.getMinutes() - minutes);

    return this.db.oTP.count({
      where: {
        inviteId,
        userId: null,
        otpType,
        createdAt: { gte: timeThreshold },
      },
    });
  }

  async validateOTPRateLimit(
    userId: number,
    otpType: OtpType,
    maxAttempts = 3,
    windowMinutes = 5,
  ): Promise<boolean> {
    const attempts = await this.getRecentOTPAttempts(
      userId,
      otpType,
      windowMinutes,
    );
    return attempts < maxAttempts;
  }

  async validateInviteOTPRateLimit(
    inviteId: number,
    otpType: OtpType,
    maxAttempts = 3,
    windowMinutes = 5,
  ): Promise<boolean> {
    const attempts = await this.getRecentInviteOTPAttempts(
      inviteId,
      otpType,
      windowMinutes,
    );
    return attempts < maxAttempts;
  }

  // Helper method to get OTP by code regardless of whether it's for user or invite
  async getOTPByCode(otpCode: string): Promise<OTP | null> {
    return this.db.oTP.findFirst({
      where: {
        otpCode,
        status: OtpStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: true,
        invite: true,
      },
    });
  }

  // Helper method to determine if OTP belongs to user or invite
  async getOTPContext(
    otpId: number,
  ): Promise<{ type: 'user' | 'invite'; id: number } | null> {
    const otp = await this.db.oTP.findUnique({
      where: { Id: otpId },
      select: { userId: true, inviteId: true },
    });

    if (!otp) return null;

    if (otp.userId) {
      return { type: 'user', id: otp.userId };
    } else if (otp.inviteId) {
      return { type: 'invite', id: otp.inviteId };
    }

    return null;
  }
}
