import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import { getMyProfile } from "../../api/myProfile";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
    const getData=async()=>{
        try {
            const data=await getMyProfile()
            console.log("🚀 ~ getData ~ data:", data)
            setUser(data?.data)

        } catch (error) {
            console.log(error)
        }
    }
  useEffect(() => {
    getData()
}, []);

  if (!user) return null;

  const roleMap: any = {
    admin: { label: "ادمین", color: "error" },
    superAdmin: { label: "مدیر ارشد", color: "error" },
    operator: { label: "اپراتور", color: "info" },
    supervisor: { label: "سرپرست", color: "warning" },
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 5, direction: "rtl" }}>
      <Card>
        <CardContent>
          <Typography variant="h5">پروفایل کاربری</Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography color="text.secondary">نام و نام خانوادگی</Typography>
              <Typography fontWeight={600}>{user.fullName || "—"}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography color="text.secondary">نام کاربری</Typography>
              <Typography fontWeight={600}>{user.username}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography color="text.secondary">ایمیل</Typography>
              <Typography fontWeight={600}>{user.email || "—"}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography color="text.secondary">نقش</Typography>
              <Chip
                label={roleMap[user.role]?.label}
                color={roleMap[user.role]?.color}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
