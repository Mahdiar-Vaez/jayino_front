import {
  paymentStatusMap,
  carTypeMap,
  statusMap,
  normalizeText
} from "./searchMapping";

export const buildSearchQuery = (input: string) => {
  const value = normalizeText(input);

  return {
    paymentStatus: paymentStatusMap[value],
    carType: carTypeMap[value],
    status: statusMap[value],
    text: value, 
  };
};
