import { IUpdateProfileValidator } from 'src/modules/profile/types/profile.types';
import { IReportValidation } from 'src/modules/reports/types/report.types';
import { ITrailValidation } from 'src/modules/trails/types/trail.types';
import { IRouteValidation } from '../modules/routes/types/route.types';

/**
 * Shared field rules. Do not remember why but decided to be typed via satisfies against module interfaces. Had reason.
 */
export const VALIDATION = {
  ROUTE: {
    MAX_LENGTH: {
      TITLE: 100,
      DESCRIPTION: 500,
    },
  } satisfies IRouteValidation,

  REPORT: {
    MAX_LENGTH: {
      ADMIN_RESPONSE: 500,
      REPORT_REASON: 500,
    },
  } satisfies IReportValidation,

  PROFILE: {
    MAX_LENGTH: {
      DISPLAY_NAME: 16,
      BIO: 96,
    },
  } satisfies IUpdateProfileValidator,

  TRAIL: {
    MAX_LENGTH: {
      TITLE: 100,
      DESCRIPTION: 500,
    },
  } satisfies ITrailValidation,
} as const;
