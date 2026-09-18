/** Target type of report. */
export enum TargetType {
  TRAIL = 'trail',
  USER = 'user',
}

/** I of report validation. */
export interface IReportValidation {
  /** MaxLen validators */
  MAX_LENGTH: {
    ADMIN_RESPONSE: number;
    REPORT_REASON: number;
  };
}
