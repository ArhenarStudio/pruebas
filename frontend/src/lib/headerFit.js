// Header capacity / "fit" rules (Visual Order v2)
export const NAV_MAX = 7;          // block adding the 8th link
export const NAV_COMFORT = 5;      // comfortable count at 14px
export const ACTION_MAX_DESKTOP = 3;
export const ACTION_MAX_MOBILE = 2;
export const MOBILE_LABEL_MAX = 8;

export function navFontSize(count, device) {
  if (device === "mobile") return 14; // nav collapses to hamburger anyway
  const base = device === "tablet" ? 13 : 14;
  if (count <= NAV_COMFORT) return base;
  return Math.max(11, base - (count - NAV_COMFORT));
}

export function navStatus(count) {
  if (count <= NAV_COMFORT) return "green";
  if (count === 6) return "amber";
  return "red";
}

export function actionMax(device) {
  return device === "mobile" ? ACTION_MAX_MOBILE : ACTION_MAX_DESKTOP;
}
