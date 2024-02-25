export const minimalDate = (d: Date) =>
  d.toLocaleDateString("en-us", { month: "short", day: "2-digit" });

export const monthDayYear = (d: Date) =>
  d.toLocaleDateString("en-us", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

// this function expects an ISO date string of the following form: 2023-11-01T00:00:00.000Z
// this function will return a Date set to midnight of the local time
// e.g. if local time is EDT, for the string above, this function will return Wed Nov 01 2023 00:00:00 GMT-0400 (Eastern Daylight Time)
// CREDS: https://stackoverflow.com/a/39224282/11587741
export const newDateLocal = (iso: string): Date => {
  return new Date(`${iso.slice(0, 10)}T00:00`);
};
