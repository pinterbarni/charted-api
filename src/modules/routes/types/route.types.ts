/** Data payload of creating new planned route. */
export type CreateRouteData = {
  userId: string;
  waypoints: object;
  valhallaResponse: object;
  title?: string;
  pois?: object[];
};

/** Route validation constraint shapes */
export interface IRouteValidation {
  /** Max len vars */
  MAX_LENGTH: {
    TITLE: number;
    DESCRIPTION: number;
  };
}
