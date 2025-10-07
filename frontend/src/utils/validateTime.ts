export function validateTime(opening: string, closing: string): boolean {
  if (opening === "00:00" && closing === "00:00") return true;

  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const open = toMinutes(opening);
  const close = toMinutes(closing);

  return close - open >= 30;
}