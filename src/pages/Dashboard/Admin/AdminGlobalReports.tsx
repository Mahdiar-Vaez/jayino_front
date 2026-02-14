import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Avatar,
  Divider,
  useTheme,
  CircularProgress,
  Stack,
  alpha,
  IconButton,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  TrendingUp,
  Calendar,
  Car,
  Truck,
  Bus,
  Clock,
  Download,
  RefreshCw,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  CreditCard,
  Wallet,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
} from 'recharts';
import PersianDatePickerCompact from '../../../Components/DataPicker';
import { reportsApi } from '../../../api/admin/admin-reports/globalReports';
import { useNotification } from '../../../utils/hooks/useNotification';
import jalaali from 'jalaali-js';

const COLORS = {
  vehicle: {
    CAR: '#2563eb',
    TRUCK: '#d97706',
    BUS: '#059669',
  },
};

const vehicleTypeLabels = {
  CAR: 'سواری',
  TRUCK: 'وانت',
  BUS: 'اتوبوس/کامیون',
};

const getTodayPersian = () => {
  const now = new Date();
  const { jy, jm, jd } = jalaali.toJalaali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );
  return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
};

const convertUTCtoTehranHour = (utcHour: number): number => (utcHour + 3) % 24;

export default function AdminReports() {
  const theme = useTheme();
  const { showNotification, NotificationComponent } = useNotification();

  // State
  const [selectedDate, setSelectedDate] = useState(getTodayPersian());
  const [dailyIncome, setDailyIncome] = useState<number | null>(null);
  const [totalIncome, setTotalIncome] = useState<number | null>(null);
  const [vehicleCounts, setVehicleCounts] = useState({
    CAR: 0,
    TRUCK: 0,
    BUS: 0,
  });
  const [peakHours, setPeakHours] = useState<{ hour: number; count: number }[]>([]);
  const [paymentIncome, setPaymentIncome] = useState<{
    CASH: number;
    CARD: number;
    total: number;
  }>({ CASH: 0, CARD: 0, total: 0 });

  const [loading, setLoading] = useState({
    daily: false,
    total: false,
    vehicle: false,
    peak: false,
    payment: false,
  });

  // ========== API Calls ==========
  const fetchDailyIncome = async (date: string) => {
    setLoading((prev) => ({ ...prev, daily: true }));
    try {
      const res = await reportsApi.getDailyIncome(date);
      setDailyIncome(res.data.totalIncome);
    } catch {
      showNotification('خطا در دریافت درآمد روزانه', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, daily: false }));
    }
  };

  const fetchTotalIncome = async () => {
    setLoading((prev) => ({ ...prev, total: true }));
    try {
      const res = await reportsApi.getTotalIncome();
      setTotalIncome(res.data.totalIncome);
    } catch {
      showNotification('خطا در دریافت درآمد کل', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, total: false }));
    }
  };

  const fetchVehicleCounts = async () => {
    setLoading((prev) => ({ ...prev, vehicle: true }));
    try {
      const res = await reportsApi.getVehicleCounts();
      setVehicleCounts(res.data.data);
    } catch {
      showNotification('خطا در دریافت تعداد خودروها', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, vehicle: false }));
    }
  };

  const fetchPeakHours = async () => {
    setLoading((prev) => ({ ...prev, peak: true }));
    try {
      const res = await reportsApi.getPeakHours();
      const converted = res.data.data.map((item: { hour: number; count: number }) => ({
        hour: convertUTCtoTehranHour(item.hour),
        count: item.count,
      }));
      setPeakHours(converted);
    } catch {
      showNotification('خطا در دریافت ساعات اوج', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, peak: false }));
    }
  };

  // ========== تابع جدید برای دریافت درآمد بر اساس روش پرداخت ==========
  const fetchPaymentMethodIncome = async () => {
    setLoading((prev) => ({ ...prev, payment: true }));
    try {
      const res = await reportsApi.getPaymentMethodIncome();
      setPaymentIncome(res.data.data);
    } catch {
      showNotification('خطا در دریافت درآمد نقدی/کارتی', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, payment: false }));
    }
  };

  useEffect(() => {
    fetchDailyIncome(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    fetchTotalIncome();
    fetchVehicleCounts();
    fetchPeakHours();
    fetchPaymentMethodIncome(); // <-- اضافه شد
  }, []);

  // ========== Computed Values ==========
  const totalSessions = useMemo(
    () => Object.values(vehicleCounts).reduce((a, b) => a + b, 0),
    [vehicleCounts]
  );

  const pieData = useMemo(
    () =>
      Object.entries(vehicleCounts)
        .filter(([, value]) => value > 0)
        .map(([key, value]) => ({
          name: vehicleTypeLabels[key as keyof typeof vehicleTypeLabels],
          value,
          color: COLORS.vehicle[key as keyof typeof COLORS.vehicle],
        })),
    [vehicleCounts]
  );

  const topPeakHour = useMemo(() => {
    if (peakHours.length === 0) return null;
    return [...peakHours].sort((a, b) => b.count - a.count)[0];
  }, [peakHours]);

  const formatCurrency = (amount: number) => {
    if (amount === null || amount === undefined) return '۰ تومان';
    return `${amount.toLocaleString('fa-IR')} تومان`;
  };

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2, md: 3 },
        direction: 'rtl',
        minHeight: '100vh',
        bgcolor: '#f9fafc',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ========== HEADER ========== */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(
            theme.palette.primary.dark,
            0.95
          )} 100%)`,
          color: 'white',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          boxShadow: `0 10px 30px -5px ${alpha(theme.palette.primary.main, 0.3)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              backdropFilter: 'blur(8px)',
            }}
          >
            <BarChart3 size={24} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="700" letterSpacing="-0.5px">
              گزارشات جامع پارکینگ
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              آمار و درآمدها را به‌صورت لحظه‌ای بررسی کنید
            </Typography>
          </Box>
        </Box>
        <Stack direction="row" spacing={1} sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}>
          <Tooltip title="بروزرسانی">
            <IconButton
              onClick={() => {
                fetchDailyIncome(selectedDate);
                fetchTotalIncome();
                fetchVehicleCounts();
                fetchPeakHours();
                fetchPaymentMethodIncome(); // <-- اضافه شد
              }}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              }}
            >
              <RefreshCw size={18} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>

      {/* ========== ردیف اول: کارت‌های آماری اصلی ========== */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 2, md: 3 },
          mb: 4,
        }}
      >
        {/* کارت ۱: درآمد کل */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 calc(33.33% - 16px)' },
            minWidth: { md: '250px' },
          }}
        >
          <Fade in timeout={500} style={{ transitionDelay: '100ms' }}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 16px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
                background: `linear-gradient(145deg, ${alpha('#fff', 1)} 0%, ${alpha('#f8fafc', 1)} 100%)`,
                height: '100%',
                display: 'flex',
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 }, width: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="600" gutterBottom>
                      درآمد کل
                    </Typography>
                    {loading.total ? (
                      <CircularProgress size={24} thickness={5} sx={{ color: theme.palette.primary.main, mt: 1 }} />
                    ) : (
                      <Typography
                        variant="h4"
                        fontWeight="700"
                        color="primary.main"
                        sx={{ mt: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}
                      >
                        {formatCurrency(totalIncome || 0)}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      از ابتدا تا کنون
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      width: { xs: 48, sm: 54 },
                      height: { xs: 48, sm: 54 },
                      borderRadius: 3,
                    }}
                  >
                    <DollarSign size={24} />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Fade>
        </Box>

        {/* کارت ۲: درآمد روزانه + دیت‌پیکر */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 calc(33.33% - 16px)' },
            minWidth: { md: '250px' },
          }}
        >
          <Fade in timeout={500} style={{ transitionDelay: '200ms' }}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.12)}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 16px 32px ${alpha(theme.palette.success.main, 0.2)}`,
                },
                background: `linear-gradient(145deg, ${alpha('#fff', 1)} 0%, ${alpha('#f0fdf4', 1)} 100%)`,
                height: '100%',
                display: 'flex',
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 }, width: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight="600" gutterBottom>
                      درآمد روزانه
                    </Typography>
                    <Box sx={{ my: 1.5, maxWidth: '100%' }}>
                      <PersianDatePickerCompact
                        value={selectedDate}
                        onChange={setSelectedDate}
                        label="تاریخ"
                      />
                    </Box>
                    {loading.daily ? (
                      <CircularProgress size={20} thickness={5} sx={{ color: theme.palette.success.main }} />
                    ) : (
                      <Typography
                        variant="h5"
                        fontWeight="700"
                        color="success.main"
                        sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}
                      >
                        {formatCurrency(dailyIncome || 0)}
                      </Typography>
                    )}
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      width: { xs: 48, sm: 54 },
                      height: { xs: 48, sm: 54 },
                      borderRadius: 3,
                      mr: 1,
                    }}
                  >
                    <Calendar size={24} />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Fade>
        </Box>

        {/* کارت ۳: تعداد جلسات */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 calc(33.33% - 16px)' },
            minWidth: { md: '250px' },
          }}
        >
          <Fade in timeout={500} style={{ transitionDelay: '300ms' }}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: `0 8px 24px ${alpha(theme.palette.info.main, 0.12)}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 16px 32px ${alpha(theme.palette.info.main, 0.2)}`,
                },
                background: `linear-gradient(145deg, ${alpha('#fff', 1)} 0%, ${alpha('#eff6ff', 1)} 100%)`,
                height: '100%',
                display: 'flex',
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 }, width: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="600" gutterBottom>
                      تعداد کل خودرو های وارد شده
                    </Typography>
                    {loading.vehicle ? (
                      <CircularProgress size={24} thickness={5} sx={{ color: theme.palette.info.main, mt: 1 }} />
                    ) : (
                      <Typography
                        variant="h4"
                        fontWeight="700"
                        color="info.main"
                        sx={{ mt: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}
                      >
                        {totalSessions.toLocaleString('fa-IR')}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      مجموع خودروهای ثبت‌شده
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                      width: { xs: 48, sm: 54 },
                      height: { xs: 48, sm: 54 },
                      borderRadius: 3,
                    }}
                  >
                    <Car size={24} />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Fade>
        </Box>
      </Box>

      {/* ========== ردیف دوم: کارت تفکیک درآمد نقدی / کارتی ========== */}
      <Box sx={{ mb: 4 }}>
        <Fade in timeout={500} style={{ transitionDelay: '400ms' }}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: `0 8px 24px ${alpha(theme.palette.secondary.main, 0.12)}`,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 16px 32px ${alpha(theme.palette.secondary.main, 0.2)}`,
              },
              background: `linear-gradient(145deg, ${alpha('#fff', 1)} 0%, ${alpha('#fef9e7', 1)} 100%)`,
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <CreditCard size={22} color={theme.palette.secondary.main} />
                  <Typography variant="h6" fontWeight="700">
                    تفکیک درآمد بر اساس روش پرداخت
                  </Typography>
                </Stack>
                {loading.payment && <CircularProgress size={22} thickness={5} />}
              </Stack>
              <Divider sx={{ mb: 3 }} />

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                {/* کارت نقدی */}
                <Box
                  sx={{
                    flex: 1,
                    width: '100%',
                    p: 2,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.success.main, 0.08),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={1.5}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.2),
                        color: theme.palette.success.main,
                        width: 48,
                        height: 48,
                      }}
                    >
                      <Wallet size={22} />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        درآمد نقدی
                      </Typography>
                      <Typography variant="h5" fontWeight="700" color="success.main">
                        {formatCurrency(paymentIncome.CASH)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* کارت کارتی */}
                <Box
                  sx={{
                    flex: 1,
                    width: '100%',
                    p: 2,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.info.main, 0.08),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={1.5}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.info.main, 0.2),
                        color: theme.palette.info.main,
                        width: 48,
                        height: 48,
                      }}
                    >
                      <CreditCard size={22} />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        درآمد کارتی
                      </Typography>
                      <Typography variant="h5" fontWeight="700" color="info.main">
                        {formatCurrency(paymentIncome.CARD)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>

              {/* مجموع هر دو روش (اختیاری) */}
              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  مجموع درآمد نقدی و کارتی:
                </Typography>
                <Typography variant="body1" fontWeight="700" color="primary.main">
                  {formatCurrency(paymentIncome.total)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Box>

      {/* ========== بخش نمودارها ========== */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 2, md: 3 },
        }}
      >
        {/* نمودار توزیع خودروها */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 4,
              height: '100%',
              background: 'white',
              boxShadow: `0 8px 24px ${alpha('#000', 0.05)}`,
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: `0 16px 32px ${alpha('#000', 0.08)}` },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* محتوای نمودار توزیع (همان قبلی) */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" gap={1}>
                <PieChartIcon size={20} color={theme.palette.primary.main} />
                <Typography variant="h6" fontWeight="700" fontSize={{ xs: '1rem', sm: '1.1rem' }}>
                  توزیع خودروها
                </Typography>
              </Stack>
              {loading.vehicle && <CircularProgress size={20} thickness={5} />}
            </Stack>
            <Divider sx={{ mb: 2 }} />
            {!loading.vehicle && pieData.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 2, flexGrow: 1 }}>
                <Box sx={{ width: { xs: '100%', md: '55%' }, height: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={2}
                        dataKey="value"
                        cornerRadius={6}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                        ))}
                        <Label
                          value={`${totalSessions.toLocaleString('fa-IR')}`}
                          position="center"
                          fontSize={18}
                          fontWeight="bold"
                          fill={theme.palette.text.primary}
                        />
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: any) => [`${value.toLocaleString('fa-IR')} خودرو`, 'تعداد']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Stack spacing={1.5} sx={{ width: { xs: '100%', md: '45%' } }}>
                  {pieData.map((item) => (
                    <Box
                      key={item.name}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.2,
                        borderRadius: 2,
                        bgcolor: alpha(item.color, 0.04),
                        border: `1px solid ${alpha(item.color, 0.1)}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '4px', bgcolor: item.color }} />
                        <Typography variant="body2" fontWeight="600">
                          {item.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="700" color={item.color}>
                        {item.value.toLocaleString('fa-IR')}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <Typography color="text.secondary">داده‌ای برای نمایش وجود ندارد</Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* نمودار ساعات اوج ترافیک */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 4,
              height: '100%',
              background: 'white',
              boxShadow: `0 8px 24px ${alpha('#000', 0.05)}`,
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: `0 16px 32px ${alpha('#000', 0.08)}` },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* محتوای نمودار ساعات اوج (همان قبلی) */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" gap={1}>
                <Clock size={20} color={theme.palette.warning.main} />
                <Typography variant="h6" fontWeight="700" fontSize={{ xs: '1rem', sm: '1.1rem' }}>
                  ساعات اوج ترافیک
                </Typography>
              </Stack>
              {loading.peak && <CircularProgress size={20} thickness={5} />}
            </Stack>
            <Divider sx={{ mb: 2 }} />

            {!loading.peak && peakHours.length > 0 ? (
              <>
                <Box sx={{ flexGrow: 1, minHeight: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={peakHours} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha('#000', 0.08)} />
                      <XAxis
                        dataKey="hour"
                        tickFormatter={(hour) => `${hour}:00`}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                      />
                      <RechartsTooltip
                        formatter={(value: any) => [`${value} ورود`, 'تعداد']}
                        labelFormatter={(hour) => `ساعت ${hour}:00`}
                        contentStyle={{
                          borderRadius: 12,
                          border: 'none',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                        }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={24}>
                        {peakHours.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.hour === topPeakHour?.hour
                                ? theme.palette.warning.main
                                : alpha(theme.palette.primary.main, 0.6)
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>

                {topPeakHour && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.warning.main, 0.08),
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Stack direction="row" alignItems="center" gap={1.5}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.warning.main, 0.2),
                          color: theme.palette.warning.main,
                          width: 36,
                          height: 36,
                        }}
                      >
                        <Clock size={18} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          پربازدیدترین ساعت
                        </Typography>
                        <Typography variant="h6" fontWeight="700" color="warning.main">
                          {topPeakHour.hour}:00
                        </Typography>
                      </Box>
                    </Stack>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body2" color="text.secondary">
                        تعداد ورود
                      </Typography>
                      <Typography variant="h5" fontWeight="700" color="warning.dark">
                        {topPeakHour.count.toLocaleString('fa-IR')}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 240 }}>
                <Typography color="text.secondary">داده‌ای برای نمایش وجود ندارد</Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      <NotificationComponent />
    </Box>
  );
}