/** Kc JWKS cli config: PK-s are cached to avoid fetching from KC always when requesting */
export const JWKS_CONFIG = {
  /** This stores how long to cache kc public keys in ms. 600000ms = 10 min. Pro tip: keys rarely change, long cache is safe. */
  CACHE_MAX_AGE_MS: 600_000,
} as const;

/** JWT verify configuration for kc tokens. */
export const JWT_CONFIG = {
  /**
   * Signing algorithm used by kc for JWTs.
   * "RS256 signature with SHA-256, asymmetric key pair". Public key fetched from kc JWKS endpoint for verifications.
   */
  ALGORITHM: 'RS256' as const,
} as const;
