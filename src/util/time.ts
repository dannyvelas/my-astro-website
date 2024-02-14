export const minimalDate = (d: Date) =>
  d.toLocaleDateString("en-us", { month: "short", day: "2-digit" });

export const monthDayYear = (d: Date) =>
  d.toLocaleDateString("en-us", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
