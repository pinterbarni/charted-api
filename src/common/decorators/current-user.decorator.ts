import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { JwtUser } from './types/decorator.types';

/**
 * Parameter decorator, extracts authenticated jwtUser (user from here on-on) from request.
 * Fact! Requires JwtAuthGuard to have run successfully before handler is called.
 * after successful JWT validation user gets set. Undefined if used on public route where guard did not run yet.
 */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): JwtUser => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return request['user'] as JwtUser;
});
