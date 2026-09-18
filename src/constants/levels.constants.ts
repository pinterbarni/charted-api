/** Level thresholds in meters, which are based on iconic real-world hiking distances. */
export const LEVEL_THRESHOLDS_M = [
  43_000, // Level 1: Inca Trail
  170_000, // Level 2: Tour du Mont Blanc
  500_000, // Level 3: Elcamino de Santiago
  1_200_000, // Level 4: Half Appalachian Trail
  3_500_000, // Level 5: Pacific Crest Trail
  8_848_000, // Level 6: Height of Everest
  12_742_000, // Level 7: Diameter of Earth
];

/** maximum level users are able to reach, defined by business logic. */
export const MAX_LEVEL = LEVEL_THRESHOLDS_M.length;
