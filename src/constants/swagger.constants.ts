/**
 * Example values for Swagger docs ti load.
 */
export const EXAMPLES = {
  MAP: {
    LOCATION: {
      LON: 19.0402,
      LAT: 47.4979,
    },
    ROUTE: {
      TITLE: 'Morning hike',
      COSTING: 'pedestrian',
    },
    POI: {
      TITLE: 'Water source',
      NOTE: 'Clean Spring',
    },
  },

  _UUID: '38fcb597-acac-4be4-bc66-cbb13cc86cad',

  _TIMESTAMP: '2026-02-31T09:00:00Z',

  REPORT: {
    REASON: 'Inappropriate content',
    RESPONSE: 'Reviewed and dismissed',
  },

  PROFILE: {
    DISPLAY_NAME: 'Barnabas123',
    BIO: 'Hiking enthusiast from an other planet',
    AVATAR_URL: 'https://media.tenor.com/x8v1oNUOmg4AAAAM/rickroll-roll.gif',
  },

  TRAIL: {
    TITLE: 'Afternoon hike',
    DURATION_S: 3600,
    ELEVATION_GAIN_M: 400,
    DISTANCE_ORIGINAL: 8.78,
    DESCRIPTION: 'A nice hike in woods. Saw deer! :D',
    DISTANCE_M: 5000,
  },
} as const;
