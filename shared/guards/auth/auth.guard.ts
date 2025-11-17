import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ALLOW_ANONYMOUS } from '../../decorators/allow-anonymous.decorator';
import { Request } from 'express';
import { JwtTokenService } from '../../jwt-token/service/jwt-token.service';
import { UserRepository } from '../../database/repositories/user/user.repository';
import { ILoggedInUserTokenData } from './interfaces/logggedInUserTokenData.interface';
import {
  IRequestUser,
  IRequestUserUnMapped,
} from './interfaces/requestUser.interface';
import { UserStatus } from '@prisma/client';
import { ResponseUtil } from '../../utils';
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtTokenService: JwtTokenService,
    private userRepository: UserRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const allowAnonymous = this.reflector.getAllAndOverride<boolean>(
        ALLOW_ANONYMOUS,
        [context.getHandler(), context.getClass()],
      );

      if (allowAnonymous) {
        return true;
      }
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (isPublic) {
        return true; // Skip authentication for public routes
      }

      const request: Request = context.switchToHttp().getRequest<Request>();

      const { authorization } = request.headers;

      if (!authorization || authorization.trim() === '') {
        return ResponseUtil.throwError(
          'Login first to access this resource.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const token = authorization.replace('Bearer ', '').trim();

      const userTokenData = this.jwtTokenService.verifyToken(
        token,
        String(process.env.AUTH_JWT_SECRET),
      ) as ILoggedInUserTokenData;

      const userData = (await this.userRepository.getUserById({
        where: { publicId: userTokenData['publicId'] },
        select: {
          id: true,
          publicId: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          isDeleted: true,
          emailVerified: true,
          phoneVerified: true,
          profileCompleted: true,
          profile: {
            select: {
              publicId: true,
              firstName: true,
              lastName: true,
              middleName: true,
              fullName: true,
              profilePhoto: true,
              dateOfBirth: true,
              gender: true,
              address: true,
              city: true,
              state: true,
              country: true,
              zipCode: true,
              emergencyContactPhone: true,
              emergencyContactName: true,
              preferredLanguage: true,
              timezone: true,
            },
          },
          patientProfile: {
            select: {
              publicId: true,
              bloodType: true,
              height: true,
              weight: true,
              allergies: true,
              chronicConditions: true,
              emergencyContactName: true,
              emergencyContactPhone: true,
              emergencyContactRelation: true,
              insuranceProvider: true,
              insuranceNumber: true,
              insurancePolicyNumber: true,
              nationalId: true,
              nextOfKinName: true,
              nextOfKinPhone: true,
              nextOfKinRelation: true,
            },
          },
          doctorProfile: {
            select: {
              publicId: true,
              licenseNumber: true,
              specialization: true,
              experience: true,
              education: true,
              certifications: true,
              consultationFee: true,
              biography: true,
              availableHours: true,
              isAvailable: true,
              rating: true,
              totalReviews: true,
              verificationStatus: true,
              verifiedAt: true,
            },
          },
        },
      })) as IRequestUserUnMapped;

      if (!userData) {
        return ResponseUtil.throwError(
          'User not found',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (userData.isDeleted) {
        return ResponseUtil.throwError(
          'User is inactive or suspended',
          HttpStatus.UNAUTHORIZED,
        );
      }

      request['user'] = {
        publicId: userData.publicId,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        status: userData.status,
        isDeleted: userData.isDeleted,
        emailVerified: userData.emailVerified,
        phoneVerified: userData.phoneVerified,
        profileCompleted: userData.profileCompleted,
        profile: userData.profile ?? null,
        patientProfile: userData.patientProfile ?? null,
        doctorProfile: userData.doctorProfile ?? null,
      } as IRequestUser;

      request['internalUser'] = { id: userData.id };

      if (
        [String(UserStatus.INACTIVE), String(UserStatus.SUSPENDED)].includes(
          request['user'].status as UserStatus,
        )
      ) {
        return ResponseUtil.throwError(
          'User is inactive or suspended',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        ResponseUtil.throwError(error.message, error.getStatus());
      }
      ResponseUtil.handleError(error);
    }
  }
}
