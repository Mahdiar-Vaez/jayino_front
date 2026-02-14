import api from "./axios"

export const getMyProfile=async()=>{
    const res= await api.get("/users/me",)
    return res.data
}