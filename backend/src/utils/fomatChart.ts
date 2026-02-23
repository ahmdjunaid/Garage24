export function formatChart(
  type: "week" | "month" | "year",
  rawData: {_id: number; count: number}[]
) {
  let labels: string[] = [];
  let max = 0;

  if (type === "week") {
    labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    max = 7;
  }

  if (type === "month") {
    max = 31;
    labels = Array.from({ length: 31 }, (_, i) =>
      String(i + 1)
    );
  }

  if (type === "year") {
    labels = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
    ];
    max = 12;
  }

  const dataArray = new Array(max).fill(0);

  rawData.forEach((item) => {
    const index = item._id - 1;
    if (index >= 0 && index < max) {
      dataArray[index] = item.count;
    }
  });

  return {
    labels,
    data: dataArray,
  };
}
