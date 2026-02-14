// 📌 نام ماه‌های شمسی (برای نمایش در صورت نیاز)
export const JALALI_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", 
  "مرداد", "شهریور", "مهر", "آبان", 
  "آذر", "دی", "بهمن", "اسفند"
];

// 📌 تبدیل اعداد به فارسی
export const toPersianNumber = (num: number | string): string => {
  return num.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
};

// 📌 مپ کردن داده‌های چارت
export const mapRevenueChartData = (apiData: {
  items: { label: string | number; total: number }[];
}) => {
  return apiData.items.map((item) => ({
    name: typeof item.label === 'string' 
      ? item.label  // برای DAILY و MONTHLY که رشته فارسی است
      : toPersianNumber(item.label.toString()), // برای YEARLY که عدد است
    value: item.total,
    // برای دیباگ - در صورت نیاز
    rawLabel: item.label,
  }));
};