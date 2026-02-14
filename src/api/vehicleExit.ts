import axios from "./axios";

export interface VehicleExitByPhone {
  phoneNumber: string;
}

export interface VehicleExitByOTP {
  otp: string;
}

export interface VehicleExitByPlate {
  plateNumber: string;
}

/* ---------- API Calls ---------- */
export const exitByPhone = async (data: VehicleExitByPhone) => {
  const res = await axios.post("/parking/exit-phone", data);

  return res.data; // { success, message, data }
};

export const exitByOTP = async (data: VehicleExitByOTP) => {
  const res = await axios.post("/parking/exit-otp", data);
  return res.data;
};

export const exitByPlate = async (data: VehicleExitByPlate) => {
  const res = await axios.post("/parking/exit-plate", data);
  console.log("🚀 ~ exitByPlate ~ res:", res.data)

  
  return res.data;
};