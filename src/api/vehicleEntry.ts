import api from "./axios";

export interface VehicleEntryBody {
  phoneNumber: string;
  plateNumber?: string;
  carType: "car" | "truck" | "bus";
}


export const vehicleEntry = async (body: VehicleEntryBody) => {
  try {
    const res = await api.post("/parking/entry", body);

    return res.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "خطای سرور";
    throw new Error(message);
  }
};