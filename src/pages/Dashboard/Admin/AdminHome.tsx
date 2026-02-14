import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { parkingReportApi, type RevenueType } from "../../../api/admin/admin-reports/report";
import RevenueLineChart, { toPersianNumberWithCommas } from "../../../Components/admin/charts/RevenueLineChart";
import RevenueChartControls from "../../../Components/admin/charts/RevenueChartControls";
import type { parkingStatsType } from "../../../types/dashboard";
import { Car, LogOut, ParkingSquare, Wallet, AlignHorizontalSpaceAround } from "lucide-react";
import theme from "../../../utils/theme/theme";
import StatCard from "../../../Components/operator/StatCard";

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
  const [parkingStats, setParkingStats] = useState<parkingStatsType | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [todayRevenue, setTodayRevenue] = useState<number>(0);
  const [type, setType] = useState<RevenueType>("DAILY");
  
  // ✅ مقداردهی اولیه سال با اطمینان کامل
  const [year, setYear] = useState<number>(() => {
    const initialYear = getCurrentJalaliYear();
    console.log("✅ سال اولیه تنظیم شد:", initialYear);
    return initialYear;
  });

  // 📊 دریافت درآمد امروز
  useEffect(() => {
    parkingReportApi.getTodayRevenue()
      .then((res) => {
        setTodayRevenue(res.data.data.total);
      })
      .catch(err => console.error("خطا در دریافت درآمد امروز:", err));
  }, []);

  // 📊 دریافت وضعیت پارکینگ
  useEffect(() => {
    const fetchStatus = async () => {
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
    fetchStatus();
  }, []);

  // 📊 دریافت چارت درآمد
  useEffect(() => {
    const fetchChart = async () => {
      try {
        // ✅ بررسی کن سال معتبر هست یا نه
        if (isNaN(year) || year < 1300) {
          console.error("❌ سال نامعتبر است:", year);
          return;
        }

        console.log(`📊 دریافت گزارش ${type} برای سال ${year}`);
        const res = await parkingReportApi.getRevenueChart({ 
          type, 
          year: year.toString() // ✅ تبدیل به رشته برای امنیت بیشتر
        });
        
        console.log("✅ داده دریافتی:", res.data.data);
        
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

  // کارت‌های آماری
  const stats = [
    // {
    //   title: "خودروهای داخل پارکینگ",
    //   value: toPersianNumber(parkingStats?.insideCount),
    //   icon: <Car />,
    //   color: theme.palette.primary.main,
    // },
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
      progress: parkingStats ? ((parkingStats.insideCount || 0) / (parkingStats.capacity || 1)) * 100 : 0,
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
    <div className="flex gap-2 flex-col">
      <Grid container spacing={2} sx={{ width: "100%", alignItems: "stretch" }}>
        {stats.map((stat, i) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={2.4}
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
    </div>
  );
};

export default AdminDashboard;