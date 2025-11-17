import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserRequestInfo } from '../interfaces/userRequestInfo.interface';

export const GetRequestInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserRequestInfo => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const getIpAddress = (req: Request): string => {
      const forwarded = req.headers['x-forwarded-for'];
      const realIp = req.headers['x-real-ip'];

      let ip: string;

      if (forwarded) {
        // x-forwarded-for can contain multiple IPs, take the first one
        const forwardedIp = Array.isArray(forwarded) ? forwarded[0] : forwarded;
        ip = forwardedIp.split(',')[0].trim();
      } else if (realIp) {
        ip = Array.isArray(realIp) ? realIp[0] : realIp;
      } else {
        ip =
          req.connection?.remoteAddress ||
          req.socket?.remoteAddress ||
          req.ip ||
          'unknown';
      }

      if (ip === '::1' || ip === '::ffff:127.0.0.1') {
        return '127.0.0.1';
      }

      if (ip.startsWith('::ffff:')) {
        return ip.substring(7);
      }

      return ip;
    };

    const getUserAgent = (req: Request): string => {
      return req.headers['user-agent'] || 'unknown';
    };

    return {
      ipAddress: getIpAddress(request),
      userAgent: getUserAgent(request),
    };
  },
);
