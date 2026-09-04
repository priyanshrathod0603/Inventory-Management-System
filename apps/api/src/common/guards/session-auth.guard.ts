import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SessionService, SESSION_COOKIE_NAME } from '../../modules/auth/services/session.service';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Check if endpoint is marked @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // 2. Extract session token strictly from HttpOnly cookie (sms_session)
    const sessionId: string | undefined = request.cookies?.[SESSION_COOKIE_NAME];

    if (!sessionId) {
      throw new UnauthorizedException('Authentication required. Please sign in.');
    }

    // 3. Validate session against database
    const sessionData = await this.sessionService.validateSession(sessionId);

    if (!sessionData) {
      throw new UnauthorizedException('Session is invalid or has expired. Please sign in again.');
    }

    const { user, session } = sessionData;

    // 4. Verify account state
    if (!user.isActive) {
      throw new UnauthorizedException('Account has been deactivated. Please contact an administrator.');
    }

    if (user.isDeleted) {
      throw new UnauthorizedException('Account not found.');
    }

    // 5. Attach authenticated user and session ID to request
    request.user = user;
    request.sessionId = session.id;

    return true;
  }
}
