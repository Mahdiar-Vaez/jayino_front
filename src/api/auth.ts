import api from "./axios";

export const login = async (username: string, password: string) => {
  try {
    const res = await api.post("/auth", { username, password });
    return res.data;
  } catch (err: any) {
    const message = err?.response?.data?.message || err?.message || "خطای سرور";
    throw new Error(message);
  }
};
