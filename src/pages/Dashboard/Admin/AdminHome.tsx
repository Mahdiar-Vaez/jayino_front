import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { parkingReportApi, type RevenueType } from "../../../api/admin/admin-reports/report";
import RevenueLineChart, { toPersianNumberWithCommas } from "../../../Components/admin/charts/RevenueLineChart";
import RevenueChartControls from "../../../Components/admin/charts/RevenueChartControls";
import type { parkingStatsType } from "../../../types/dashboard";
import { LogOut, ParkingSquare, Wallet, AlignHorizontalSpaceAround, RefreshCw } from "lucide-react";
import theme from "../../../utils/theme/theme";
import StatCard from "../../../Components/operator/StatCard";
import { useAuth } from "../../../context/useAuth";
import api from "../../../api/axios";
import { useNotification } from "../../../utils/hooks/useNotification";

// ✅ تابع مطمئن برای دریافت سال شمسی
const getCurrentJalaliYear = (): number => {
  try {
    const formatter = new Intl.DateTimeFormat("fa-IR", { year: "numeric" });
    const yearStr = formatter.format(new Date());
    const year = parseInt(yearStr.replace(/[^0-9]/g, ""));
    if (!isNaN(year) && year > 1300) {
      return year;
    }
  } catch (e) {}
  return 1403; // fallback
};

// ✅ تابع تبدیل اعداد به فارسی
const toPersianNumber = (num: number | string | undefined): string => {
  if (num === undefined || num === null) return "۰";
  return num.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
};

// ✅ تابع فرمت مبلغ
const formatCurrency = (amount: number): string => {
  return `${toPersianNumberWithCommas(amount)} تومان`;
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const { showNotification, NotificationComponent } = useNotification();
  const [parkingStats, setParkingStats] = useState<parkingStatsType | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [todayRevenue, setTodayRevenue] = useState<number>(0);
  const [type, setType] = useState<RevenueType>("DAILY");
  const [year, setYear] = useState<number>(() => getCurrentJalaliYear());

  // حالت‌های مودال ریست
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  // 📊 دریافت درآمد امروز
  useEffect(() => {
    parkingReportApi.getTodayRevenue()
      .then((res) => {
        setTodayRevenue(res.data.data.total);
      })
      .catch(err => console.error("خطا در دریافت درآمد امروز:", err));
  }, []);

  // 📊 دریافت وضعیت پارکینگ
  const fetchParkingStatus = async () => {
    try {
      const res = await parkingReportApi.getParkingStatus();
      const todayExitRes = await parkingReportApi.getTodayExits();
      setParkingStats({
        ...res.data.data,
        exitToday: todayExitRes.data.data.exitsToday
      });
    } catch (err) {
      console.error("Parking status error:", err);
    }
  };

  useEffect(() => {
    fetchParkingStatus();
  }, []);

  // 📊 دریافت چارت درآمد
  useEffect(() => {
    const fetchChart = async () => {
      try {
        if (isNaN(year) || year < 1300) {
          console.error("❌ سال نامعتبر است:", year);
          return;
        }

        const res = await parkingReportApi.getRevenueChart({ 
          type, 
          year: year.toString()
        });
        
        if (res.data.data && res.data.data.items) {
          setChartData(res.data.data.items);
        } else {
          setChartData([]);
        }
      } catch (err) {
        console.error("❌ خطا در دریافت چارت:", err);
      }
    };
    
    fetchChart();
  }, [type, year]);

  // ========== عملیات ریست پارکینگ ==========
  const handleOpenResetModal = () => setResetModalOpen(true);
  const handleCloseResetModal = () => setResetModalOpen(false);

  const handleConfirmReset = async () => {
    setResetting(true);
    try {
      await api.post('/parking/reset');
      showNotification("پارکینگ با موفقیت ریست شد. تمام خودروها با هزینه صفر خارج شدند.", "success");
      await fetchParkingStatus(); // به‌روزرسانی آمار
    } catch (error: any) {
      showNotification(error.response?.data?.message || "خطا در ریست پارکینگ", "error");
    } finally {
      setResetting(false);
      handleCloseResetModal();
    }
  };

  // کارت‌های آماری
  const stats = [
    {
      title: "ظرفیت پارکینگ",
      value: toPersianNumber(parkingStats?.capacity),
      icon: <ParkingSquare />,
      color: theme.palette.info.main,
    },
    {
      title: "خروجی امروز",
      value: toPersianNumber(parkingStats?.exitToday),
      icon: <LogOut />,
      color: theme.palette.success.main,
    },

{
  title: "ظرفیت خالی",
  value: toPersianNumber(parkingStats?.available),
  icon: <AlignHorizontalSpaceAround />,
  progress: parkingStats
    ? Number(
        (
          ((parkingStats.insideCount || 0) / (parkingStats.capacity || 1)) *
          100
        ).toFixed(2)
      )
    : 0,
  color: theme.palette.warning.main,
},
    {
      title: "درآمد امروز",
      value: formatCurrency(todayRevenue),
      icon: <Wallet />,
      color: theme.palette.success.main,
    }
  ];

  // عنوان داینامیک چارت
  const getChartTitle = (): string => {
    switch (type) {
      case "DAILY":
        return "📊 درآمد ۷ روز اخیر";
      case "MONTHLY":
        const validYear = isNaN(year) ? getCurrentJalaliYear() : year;
        return `📊 درآمد ماهانه سال ${toPersianNumber(validYear)}`;
      case "YEARLY":
        return "📊 درآمد سالیانه";
      default:
        return "گزارش درآمد";
    }
  };

  if (!parkingStats) {
    return (
      <Typography sx={{ mt: 4 }} align="center">
        در حال بارگذاری داشبورد...
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3, direction: "rtl" }}>
      {/* هدر با دکمه ریست (فقط برای superAdmin) */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          داشبورد مدیریت
        </Typography>
        {user?.role === "superAdmin" && (
          <Button
            variant="contained"
            color="error"
            onClick={handleOpenResetModal}
            sx={{ borderRadius: 2 }}
          >
            بازنشانی ظرفیت پاریکینگ
          </Button>
        )}
      </Box>

      {/* کارت‌های آماری */}
      <Grid container spacing={2} sx={{ width: "100%", alignItems: "stretch", justifyContent: { xs: "center", md: "start" } }}>
        {stats.map((stat, i) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={i}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <StatCard {...stat} style={{ width: "100%" }} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
        {getChartTitle()}
      </Typography>

      <RevenueChartControls
        type={type}
        setType={setType}
        year={year}
        setYear={setYear}
      />

      <Grid item xs={12} sx={{ mt: 2 }}>
        <RevenueLineChart data={chartData} />
      </Grid>

      {/* مودال تأیید ریست با هشدار */}
      <Dialog
        open={resetModalOpen}
        onClose={handleCloseResetModal}
        maxWidth="xs"
        fullWidth
        dir="rtl"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ color: "warning.main", display: "flex", alignItems: "center", gap: 1 }}>
          <RefreshCw size={24} />
          <Typography variant="h6" fontWeight="700">
            ریست کردن پارکینگ
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity="error" sx={{ mb: 2 }}>
            ⚠️ این کار توصیه نمی‌شود مگر در موارد ضروری!
          </Alert>
          <Typography variant="body2" color="text.secondary" paragraph>
            با تأیید، تمام خودروهای داخل پارکینگ بدون محاسبه هزینه (هزینه صفر) خارج می‌شوند. این عملیات غیرقابل بازگشت است و ممکن است منجر به از دست رفتن اطلاعات درآمدی شود.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseResetModal} variant="outlined" color="inherit">
            انصراف
          </Button>
          <Button
            onClick={handleConfirmReset}
            variant="contained"
            color="error"
            disabled={resetting}
          >
            {resetting ? <CircularProgress size={20} /> : "تأیید و ریست"}
          </Button>
        </DialogActions>
      </Dialog>

      <NotificationComponent />
    </Box>
  );
};

export default AdminDashboard;
