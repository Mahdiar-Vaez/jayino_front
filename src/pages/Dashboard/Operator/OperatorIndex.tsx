import { Alert, Box, Grid, Typography, useTheme } from "@mui/material";
import {
  AlignHorizontalSpaceAround,
  Car,
  LogOut,
  ParkingSquare,
  CarFront,
} from "lucide-react";
import { useEffect, useState } from "react";
import StatCard from "../../../Components/operator/StatCard";
import EntryForm from "../../../Components/operator/EntryForm";
import { vehicleEntry, type VehicleEntryBody } from "../../../api/vehicleEntry";
import { toast } from "react-toastify";
import { parkingReportApi } from "../../../api/admin/admin-reports/report";
import type { parkingStatsType } from "../../../types/dashboard";

const OperatorIndex: React.FC = () => {
  const theme = useTheme();
  const [entryLoading, setEntryLoading] = useState(false);
  const [refreshTrig,setRefreshtrig]=useState(0)
  const [parkingStats, setParkingStats] = useState<parkingStatsType>();
  console.log("🚀 ~ OperatorIndex ~ parkingStats:", parkingStats);
  const fetchData = async () => {
    try {
      const res = await parkingReportApi.getParkingStatus();
      const todayExitRes=await parkingReportApi.getTodayExits()
      console.log("🚀 ~ fetchData ~ todayExitRes:", todayExitRes)
      
      setParkingStats({...res.data.data,exitToday:todayExitRes.data.data.exitsToday});
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [refreshTrig]);
  const AvailableCapacity:string=(Number((parkingStats?.insideCount||0)/(parkingStats?.capacity||10))*100).toFixed(2)
  const stats = [
    {
      title: "خودروهای داخل پارکینگ",
      value: parkingStats?.insideCount,
      icon: <Car />,
      color: theme.palette.primary.main,
    },
    {
      title: "ظرفیت پارکینگ",
      value: parkingStats?.capacity,
      icon: <ParkingSquare />,
      color: theme.palette.info.main,
    },
    {
      title: "خروجی امروز",
      value: parkingStats?.exitToday,
      icon: <LogOut />,
      color: theme.palette.success.main,
    },
    {
      title: "ظرفیت خالی",
      value: parkingStats?.available,
      icon: <AlignHorizontalSpaceAround />,
      progress:AvailableCapacity,
      color: theme.palette.warning.main,
    },
  ];

const handleEntry = async (data: VehicleEntryBody) => {
  try {
    setEntryLoading(true);
    const res = await vehicleEntry(data);
    if (res.success) {
      // بررسی وضعیت ارسال پیامک
      const smsStatus = res.smsSent ? '✅ پیامک ارسال شد' : '⚠️ پیامک ارسال نشد';
      toast.success(`${res.message} (${smsStatus})`);
      setRefreshtrig(prev => prev + 1);
    } else {
      toast.error(res.message || "خطا در ثبت ورود");
    }
  } catch (err: any) {
    console.log("🚀 ~ handleEntry ~ err:", err);
    toast.error(err.message || "خطای سرور");
  } finally {
    setEntryLoading(false);
  }
};

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" mb={2}>
        مدیریت ورود و خروج خودروها
      </Typography>

      <Grid container spacing={3} my={3}>
        {stats.map((stat, i) => (
          <Grid item xs={12} md={3} key={i}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <EntryForm onSubmit={handleEntry} loading={entryLoading} />

      <Box mt={4}>
        <Alert severity="info" icon={<CarFront />}>
          در صورت عدم ثبت پلاک، سشن فقط با شماره موبایل ایجاد می‌شود.
        </Alert>
      </Box>
    </Box>
  );
};

export default OperatorIndex;
