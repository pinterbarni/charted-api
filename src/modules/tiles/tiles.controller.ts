import { All, Controller, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import axios from 'axios';
import type { Request, Response } from 'express';
import { CACHE_TTL_SECONDS } from 'src/constants/cache.constants';
import { Public } from '../../common/decorators/public.decorator';
import { AppConfig } from '../../config/types/app.types';

/**
 * Proxies all tile requests to Martin tile server (PROXY ONLY!). Feature: this one injects Martin API key server-side, so it's never exposed to client. Endpoints are excluded from swagger for reason! - is an internal proxy.
 */
@ApiTags('tiles')
@Controller('tiles')
export class TilesController {
  /** Base URL of Martin tile server on Vesta. */
  private readonly martinUrl: string;

  /** API key injected into every proxied tile request. */
  private readonly martinApiKey: string;

  constructor(private readonly configService: ConfigService<AppConfig>) {
    this.martinUrl = this.configService.get('MARTIN_URL', { infer: true })!;

    this.martinApiKey = this.configService.get('MARTIN_API_KEY', { infer: true })!;
  }

  /** Proxies all requests to Martin with API key injection and 24h caching.
   * TODO: Implement caching on c-side!
   */
  @ApiExcludeEndpoint()
  @All('*path')
  @Public()
  async proxy(@Req() req: Request, @Res() res: Response) {
    const targetUrl = `${this.martinUrl}${req.path.replace('/api/tiles', '')}`;

    const response = await axios({
      method: req.method,
      url: targetUrl,

      params: {
        ...req.query,
        key: this.martinApiKey,
      },
      responseType: 'arraybuffer',
      headers: {
        'Accept-Encoding': req.headers['accept-encoding'],
      },
    });

    const contentType = response.headers['content-type'] as string | undefined;

    const contentEncoding = response.headers['content-encoding'] as string | undefined;

    const headers: Record<string, string> = {
      'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS.TILES}`,
    };

    if (contentType) headers['Content-Type'] = contentType;
    if (contentEncoding) headers['Content-Encoding'] = contentEncoding;

    res.set(headers);
    res.status(response.status).send(response.data);
  }
}
