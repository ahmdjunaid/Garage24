export function getDateRanges(type: "week" | "month" | "year") {
  const now = new Date();
  let start!: Date;
  let prevStart!: Date;
  let prevEnd!: Date;

  switch (type) {
    case "week":
      start = new Date();
      start.setDate(now.getDate() - 7);

      prevStart = new Date();
      prevStart.setDate(start.getDate() - 7);
      prevEnd = start;
      break;

    case "month":
      start = new Date();
      start.setMonth(now.getMonth() - 1);

      prevStart = new Date();
      prevStart.setMonth(start.getMonth() - 1);
      prevEnd = start;
      break;

    case "year":
      start = new Date(now.getFullYear(), 0, 1);

      prevStart = new Date(now.getFullYear() - 1, 0, 1);
      prevEnd = new Date(now.getFullYear(), 0, 1);
      break;
  }

  return {
    current: { start, end: now },
    previous: { start: prevStart, end: prevEnd },
  };
}
