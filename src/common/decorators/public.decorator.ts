import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from 'src/constants/decorator.constants';

/**
 * route handler / controller becomes publicly accessible with this, bypassing global JwtAuthGuard.
 * When applied, JwtAuthGuard skips JWT validation for decorated handler.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
