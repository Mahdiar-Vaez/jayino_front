
export const paymentStatusMap: Record<string, string> = {
  "پرداخت نشده": "UNPAID",
  "پرداخت‌نشده": "UNPAID",
  "unpaid": "UNPAID",

  "پرداخت شده": "PAID",
  "paid": "PAID",
};

export const carTypeMap: Record<string, string> = {
  "سواری": "CAR",
  "car": "CAR",

  "وانت": "TRUCK",
  "truck": "TRUCK",

  "اتوبوس": "BUS",
  "bus": "BUS",
};

export const statusMap: Record<string, string> = {
  "داخل": "IN",
  "in": "IN",

  "خارج": "OUT",
  "out": "OUT",
};



export const normalizeText = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک");


    