import { All, Controller, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import axios from 'axios';
import type { Request, Response } from 'express';
import { AppConfig } from '../../config/types/app.types';

/**
 * Proxies all routing requests to Valhalla routing engine. ONLY PROXY! ( Endpoints are excluded from Swagger internal proxy only )
 * Returns 503 if Valhalla is unreachable.
 * todo: fix, valhalla seems to be unreachable. used to work. V2
 */
@ApiTags('routing')
@Controller('api/routing')
export class RoutingController {
  /** Base URL of Valhalla on vesta prod. */
  private readonly valhallaUrl: string;

  /**
   * @param configService NestJS config service for reading env vars // don by docs
   */
  constructor(private readonly configService: ConfigService<AppConfig>) {
    this.valhallaUrl = this.configService.get('VALHALLA_URL', { infer: true })!;
  }

  /** Proxies all routing requests to Valhalla. HAndles - returns Valhalla errors directly. */
  @ApiExcludeEndpoint()
  @All('*path')
  async proxy(@Req() req: Request, @Res() res: Response) {
    const targetUrl = `${this.valhallaUrl}${req.path.replace('/api/routing', '')}`;

    const contentType = req.headers['content-type'];

    try {
      const response = await axios<unknown>({
        headers: contentType ? { 'Content-Type': contentType } : {},

        url: targetUrl,
        method: req.method,
        params: req.query,
        data: req.body as unknown,
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('ROUTING Proxy ERR:', error);
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: 'Routing service not available' });
      }
    }
  }
}
