import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwksRsa, { JwksClient } from 'jwks-rsa';
import { JwtUser } from 'src/common/decorators/types/decorator.types';
import { JWKS_CONFIG, JWT_CONFIG } from 'src/constants/auth.constants';
import { IS_PUBLIC_KEY } from 'src/constants/decorator.constants';
import { AppConfig } from '../../../config/types/app.types';
import { DecodedTokenHeader } from '../types/guards.types';

/**
 * Global jwt auth guard, validates kc jwt tokens on every incoming req via JWKS verification.
 * Registered via APP_GUARD in AppModule; protects all routes by default.
 * @Public() decorator marks routes that bypass auth.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  /** JWKS client for fetching and caching KC public keys. */
  private readonly jwksClient: JwksClient;

  /**
   * Inits guard by creating JWKS client pointed at kc JWKS endpoint. Public keys are cached to avoid network request to KC on every incoming req.
   * @param jwtService NestJS jWT service for token decode & verify
   * @param configService N.JS config service for reading env vars
   * @param reflector - N.JS reflector for reading route metadata
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppConfig>,
    private readonly reflector: Reflector
  ) {
    const jwksUri = this.configService.get('KEYCLOAK_JWKS_URI', { infer: true });

    /**
     * JWKS client configured with caching to avoid fetching public keys/ on every req. Keys are cached for 10m-s.
     */
    this.jwksClient = new jwksRsa.JwksClient({
      jwksUri: jwksUri as string,

      cache: true,
      cacheMaxAge: JWKS_CONFIG.CACHE_MAX_AGE_MS,
    });
  }

  /**
   * main guard method, called by NestJS before every route handled. true or UnauthorizedException to reject.
   * @param context - NestJS execution context providing access to request
   * @returns True if req is authorized
   * @throws {UnauthorizedException} If token is missing, bad-formed (malformed?) || invalid
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublicRoute(context)) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.verifyToken(token);

      request['user'] = payload;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;

      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // #region Private helpers

  /**
   * JWT token verifier against kc JWKS endpoint. "Decodes token header to get key id, fetches matching public key" then verifies - using RS256. (todo check if rs256)
   * @param token - Raw JWt token string
   * @returns Decoded and verified JWT   payload as JwtUser
   * @throws {UnauthorizedException} token format is invalid
   * @throws {UnauthorizedException} Token signature verification fails
   */
  private async verifyToken(token: string): Promise<JwtUser> {
    const decoded: DecodedTokenHeader | null = this.jwtService.decode(token, {
      complete: true,
    });

    if (!decoded?.header?.kid) {
      throw new UnauthorizedException('Invalid token format');
    }

    const key = await this.jwksClient.getSigningKey(decoded.header.kid);

    const publicKey = key.getPublicKey();

    return this.jwtService.verifyAsync<JwtUser>(token, {
      publicKey,
      algorithms: [JWT_CONFIG.ALGORITHM],
    });
  }

  /**
   * Checks as current route is marked as public via @Public(). reflector used from nestjs to read metadata from handler and controller.
   * @param context - NestJS execution context
   * @returns True if route is decorated with @Public()
   */
  private isPublicRoute(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  /**
   * This one extracts Bearer token from auth header.
   * @param request Express request object
   * @returns raw JWT token string, or null if not present
   */
  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) return null;
    return authHeader.slice(7);
  }

  // #endregion
}
