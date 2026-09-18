import { Module } from '@nestjs/common';
import { TilesController } from './tiles.controller';

/**
 * Provides map tile proxy to Martin tile server.
 * Controller handles everything directly. No providers, no exports here. Just proxy
 */
@Module({
  controllers: [TilesController],
})
export class TilesModule {}
