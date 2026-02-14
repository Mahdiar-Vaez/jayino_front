// utils/revenueChartMapper.ts
import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday);
const persianMonths = [
  "فروردین", "اردیبهشت", "خرداد", "تیر",
  "مرداد", "شهریور", "مهر", "آبان",
  "آذر", "دی", "بهمن", "اسفند",
];

export const mapRevenueChartData = (data: any[], type: string) => {
  if (!Array.isArray(data)) return [];

  // ✅ DAILY_RANGE (۷ روز اخیر)
  if (type === "DAILY_RANGE") {
    return data.map((item) => {
      const date = dayjs()
        .year(item._id.y)
        .month(item._id.m - 1)
        .date(item._id.d);

      return {
        name: date.calendar("jalali").format("dddd"),
        revenue: item.total,
      };
    });
  }

  // ✅ MONTHLY (۱۲ ماه کامل)
  if (type === "MONTHLY") {
    const map = new Map<number, number>();

    data.forEach((item) => {
      map.set(item._id.m, item.total);
    });

    // 🔥 حتماً ۱۲ ماه تولید می‌کنیم
    return Array.from({ length: 12 }).map((_, i) => ({
      name: persianMonths[i],
      revenue: map.get(i + 1) || 0,
    }));
  }

  // ✅ YEARLY
  if (type === "YEARLY") {
    return data.map((item) => ({
      name: item._id.y.toString(),
      revenue: item.total,
    }));
  }

  return [];
};
