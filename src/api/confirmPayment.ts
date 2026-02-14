import api from "./axios";

export interface ConfirmPaymentPayload {
  sessionId: string;
  paymentMethod: "CASH" | "CARD";
}

export const confirmPayment = async (
  data: ConfirmPaymentPayload
) => {
  const res = await api.post("/parking/confirm-payment", data);
  return res.data;
};