export const getWeeksInMonth = (month: number, year: number) => {
  const weeks: { days: (Date | null)[] }[] = [];

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  let current = new Date(firstDayOfMonth);
  let week: (Date | null)[] = [];

  while (current <= lastDayOfMonth) {
    const day = current.getDay(); // 0 (Sun) to 6 (Sat)
    const dayIndex = day === 0 ? 6 : day - 1; // Convert to Mon=0, Sun=6
    if (week.length === 0 && dayIndex !== 0) {
      week = Array(dayIndex).fill(null); // Fill leading nulls
    }

    week.push(new Date(current));

    if (week.length === 7) {
      weeks.push({ days: week });
      week = [];
    }

    current.setDate(current.getDate() + 1);
  }

  if (week.length > 0) {
    week = [...week, ...Array(7 - week.length).fill(null)]; // Trailing nulls
    weeks.push({ days: week });
  }

  const extraStart = weeks[0].days.some((d) => d === null);
  const extraEnd = weeks[weeks.length - 1].days.some((d) => d === null);

  return {
    fullWeeks: weeks.slice(extraStart ? 1 : 0, extraEnd ? -1 : weeks.length),
    extraStartWeek: extraStart ? weeks[0] : null,
    extraEndWeek: extraEnd ? weeks[weeks.length - 1] : null,
  };
};
