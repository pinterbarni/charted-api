/**
 * Cache time-to-live values in seconds for different resource types. Tile data changes infrequently so gets long TTL.
 * Cache-Control headers use to control how long responses are cached by clients, n CDNs.
 */
export const CACHE_TTL_SECONDS = {
  /** less than, but approximately 24 hours, hence tile data from Martin changes infrequently. */
  TILES: 80_000,
} as const;
