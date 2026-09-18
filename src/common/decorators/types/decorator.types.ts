/**
 * Decoded JWT payload from KC. Set on request object by JwtAuthGuard after token validation successfully.
 */
export interface JwtUser {
  /** Keycloak usr uuid: used as PK in users table. */
  sub: string;

  /** User's email addr from KC. */
  email: string;

  /** User's username from KC. */
  preferred_username: string;

  /** KC realm roles assigned to user. */
  realm_access: {
    roles: string[];
  };
}
