import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ErrorResponse, ResponseUtil } from '../../utils';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService {
  constructor(private jwtService: JwtService) {}

  CreateToken(tokenPayload: object, secret: string, expiresIn: string): string {
    const jwtSecret = secret || String(process.env.AUTH_JWT_SECRET);
    const jwtExpiresIn = expiresIn || String(process.env.AUTH_JWT_EXPIRES_TIME);
    if (!tokenPayload || !jwtSecret || !jwtExpiresIn) {
      throw new ErrorResponse(
        'JWT secret or expiration time or token type is not configured properly.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.jwtService.sign(
      { ...tokenPayload },
      {
        secret: jwtSecret,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        expiresIn: jwtExpiresIn as any,
      },
    );
  }
  /**
   * Verifies a JWT token using the configured secret and checks its expiration.
   *
   * @param userToken - The JWT token string to verify.
   * @param secret
   * @returns The decoded token payload if valid.
   * @throws {ErrorResponse} if the token is missing, invalid, or expired.
   */
  verifyToken = (userToken: string, secret: string): any => {
    try {
      const jwtSecret = secret ?? process.env.AUTH_JWT_SECRET;
      if (!userToken || !jwtSecret) {
        return ResponseUtil.throwError(
          'Missing JWT token or secret',
          HttpStatus.UNAUTHORIZED,
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const initialVerifyResult = this.jwtService.verify(userToken, {
        secret: jwtSecret,
      });
      if (
        typeof initialVerifyResult === 'object' &&
        initialVerifyResult !== null
      ) {
        if (
          'exp' in initialVerifyResult &&
          Date.now() >= initialVerifyResult['exp'] * 1000
        ) {
          return ResponseUtil.throwError(
            'Token is expired or invalid',
            HttpStatus.UNAUTHORIZED,
          );
        }
      } else {
        return ResponseUtil.throwError(
          'Token is invalid',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return initialVerifyResult;
    } catch (error) {
      if (
        error instanceof JsonWebTokenError ||
        error instanceof UnauthorizedException
      ) {
        ResponseUtil.throwError(
          'Please login to access the requested resource',
          HttpStatus.UNAUTHORIZED,
        );
      }
      ResponseUtil.handleError(error);
    }
  };
}
