// pages/admin/AdminDailyReports.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Fade,
 
} from "@mui/material";
import { RefreshCw, Calendar, PlusCircle } from "lucide-react";
import { reportsApi } from "../../../api/admin/admin-reports/globalReports";
import ServerDataGrid from "../../../Components/server/DataGrid";
import { dailyReportColumns } from "../../../Components/server/columns"; 
import { useNotification } from "../../../utils/hooks/useNotification";

export default function AdminDailyReports() {
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [closingDay, setClosingDay] = useState(false);

  const { showNotification, NotificationComponent } = useNotification();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const sort =
        sortModel.length > 0
          ? `${sortModel[0].sort === "desc" ? "-" : ""}${sortModel[0].field}`
          : "-date"; // مرتب‌سازی پیش‌فرض بر اساس تاریخ نزولی

      const res = await reportsApi.getDailyReports({
        page: page + 1,
        limit: pageSize,
        sort,
      });
      console.log("🚀 ~ fetchReports ~ res:", res)
      setRows(res.data.data);
      setRowCount(res.data.total);
    } catch (error) {
      showNotification("خطا در دریافت گزارشات", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, pageSize, sortModel]);



  return (
    <Box sx={{ p: 3, direction: "rtl", minHeight: "100vh", bgcolor: "#f9fafc" }}>
      {/* هدر */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: `linear-gradient(135deg, #1976d2 0%, #1565c0 100%)`,
          color: "white",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 10px 30px -5px rgba(25, 118, 210, 0.3)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Calendar size={28} />
          <Box>
            <Typography variant="h5" fontWeight="700">
              گزارشات روزانه
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              خلاصه عملکرد روزانه پارکینگ
            </Typography>
          </Box>
        </Box>
        <Stack direction="row" spacing={2}>
          <Tooltip title="بروزرسانی">
            <IconButton
              onClick={fetchReports}
              sx={{
                color: "white",
                bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
            >
              <RefreshCw size={20} />
            </IconButton>
          </Tooltip>
       
        </Stack>
      </Paper>

      {/* جدول گزارشات */}
      <Fade in timeout={500}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            background: "white",
            boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <ServerDataGrid
            rows={rows}
            columns={dailyReportColumns}
            loading={loading}
            page={page}
            pageSize={pageSize}
            rowCount={rowCount}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            sortModel={sortModel}
            onSortChange={setSortModel}
            getRowId={(row) => row._id}
          />
        </Paper>
      </Fade>

      <NotificationComponent />
    </Box>
  );
}