// #region Type aliases

/**
 * Data payload for new trail creation.
 */
export type CreateTrailData = {
  title: string;
  startedAt?: Date;
  distanceUnit?: DistanceUnit;
  distanceOriginal?: number;
  elevationGainM?: number;
  isShared?: boolean;
  durationS?: number;

  trackPoints?: object[];
  pois?: object[];

  description?: string;
  distanceM?: number;
  finishedAt?: Date;
};

/**
 * Allowed fields for updating an existing trail post-creation. .
 */
export type UpdateTrailData = {
  title?: string;
  description?: string;
  isShared?: boolean;
};

// #endregion

// #region

/** Interface for trail validation.  */
export interface ITrailValidation {
  /** Max length validaton. */
  MAX_LENGTH: {
    TITLE: number;
    DESCRIPTION: number;
  };
}

// endregion

// #region Enums

export enum DistanceUnit {
  KM = 'km',
  MI = 'mi',
}

// #endregion
