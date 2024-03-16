import { DateTime } from "luxon";

const newYorkIANATimeZone = "America/New_York";

export const minimalDate = (d: Date) =>
  d.toLocaleDateString("en-us", {
    month: "short",
    day: "2-digit",
    timeZone: newYorkIANATimeZone,
  });

export const monthDayYear = (d: Date) =>
  d.toLocaleDateString("en-us", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: newYorkIANATimeZone,
  });

export const detailDate = (d: Date): string =>
  d.toLocaleDateString("en-us", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: newYorkIANATimeZone,
    timeZoneName: "short",
  });

// this function expects an ISO date string of the following form: 2023-11-01T00:00:00.000Z
// this function will return a Date set to midnight of "America/New_York"
// e.g. if "America/New_York" is in EDT, for the string above, this function will return Wed Nov 01 2023 00:00:00 GMT-0400 (Eastern Daylight Time)
export const newDateET = (iso: string): Date =>
  DateTime.fromISO(iso.slice(0, 10), { zone: newYorkIANATimeZone }).toJSDate();
