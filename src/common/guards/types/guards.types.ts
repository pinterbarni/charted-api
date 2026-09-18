import { JwtUser } from 'src/common/decorators/types/decorator.types';

/**
 * Represents decoded JWT token structure before signature verification. Used to extract key id (kid, like child) from token header to fetch correct public key from Keycloak JWKS endpoint.
 */
export interface DecodedTokenHeader {
  /** JWT header containing key ID used for signature verification. */
  header: { kid: string };
  /** JWT payload containing usr claims. */
  payload: JwtUser;
}
