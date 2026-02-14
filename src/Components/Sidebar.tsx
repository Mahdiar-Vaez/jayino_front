import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  alpha,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Typography,
} from "@mui/material";
import {
  BarChart,
  Users,
  FileText,
  ReceiptPoundSterlingIcon,
  Calendar,
  LogOut,
  AlertTriangle,
  ParkingCircle,
  CalendarArrowDown,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { reportsApi } from "../api/admin/admin-reports/globalReports"; // مسیر را اصلاح کنید
import { useNotification } from "../utils/hooks/useNotification";
import type { Role } from "../context/AuthContext";

const drawerWidth = 240;

const buildMenu = (role?: Role) => {
  if (role === "admin" || role == "superAdmin") {
    return [
      {
        text: "داشبورد",
        icon: <BarChart size={20} />,
        path: "/dashboard/admin",
      },
      {
        text: "مدیریت کاربران",
        icon: <Users size={20} />,
        path: "/dashboard/admin/users",
      },
      {
        text: "سشن های پارکینگ",
        icon: <FileText size={20} />,
        path: "/dashboard/admin/parking",
      },
      {
        text: "گزارشات عمومی",
        icon: <ReceiptPoundSterlingIcon size={20} />,
        path: "/dashboard/admin/global-reports",
      },
      {
        text: "گزارشات روزانه",
        icon: <Calendar size={20} />,
        path: "/dashboard/admin/daily-reports",
      },
    ];
  }

  if (role === "operator") {
    return [
      {
        text: "اپراتور",
        icon: <BarChart size={20} />,
        path: "/dashboard/operator/operator-view",
      },
      {
        text: "خروج خودرو",
        icon: <FileText size={20} />,
        path: "/dashboard/operator/car-exit",
      },
    ];
  }

  if (role === "supervisor") {
    return [
      {
        text: "داشبورد",
        icon: <BarChart size={20} />,
        path: "/dashboard/supervisor",
      },
      {
        text: "گزارش های عمومی",
        icon: <CalendarArrowDown size={20} />,
        path: "/dashboard/supervisor/global-reports",
      },
      {
        text: "گزارش روزانه",
        icon: <Calendar size={20} />,
        path: "/dashboard/supervisor/daily-reports",
      },
      {
        text: "سشن های پارکینگ",
        icon: <ParkingCircle size={20} />,
        path: "/dashboard/supervisor/parking-sessions",
      },
    ];
  }
  return [];
};

const Sidebar = ({
  mobileOpen,
  handleDrawerTransitionEnd,
  handleDrawerClose,
  role,
}: {
  mobileOpen: boolean;
  handleDrawerTransitionEnd: () => void;
  handleDrawerClose: () => void;
  role?: Role;
}) => {
  const location = useLocation();
  const menuItems = buildMenu(role) || [];
  const { showNotification, NotificationComponent } = useNotification();

  // state برای مودال تأیید
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [closingDay, setClosingDay] = useState(false);
  const [linkToOtherPage, setLinkToOtherPage] = useState<
    "entry" | "exit" | null
  >('entry');
  const handleOpenConfirmModal = () => {
    setConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalOpen(false);
  };

  const handleConfirmCloseDay = async () => {
    setClosingDay(true);
    handleCloseConfirmModal(); // بستن مودال
    try {
      await reportsApi.closeDay();
      showNotification("روز کاری با موفقیت بسته شد.", "success");
    } catch (error: any) {
      const msg = error.response?.data?.message || "خطا در بستن روز";
      showNotification(msg, "error");
    } finally {
      setClosingDay(false);
    }
  };

// درون کامپوننت Sidebar
const navigate = useNavigate();

const handleChangePage = useCallback(() => {
  if (location.pathname.includes("/operator-view")) {
    navigate("/dashboard/operator/car-exit");
  } else {
    navigate("/dashboard/operator/operator-view");
  }
}, [location.pathname, navigate]);

useEffect(() => {
  if(role!='operator') return
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "F4") {
      e.preventDefault();
      handleChangePage();
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [handleChangePage,role]);
  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar />
      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={handleDrawerClose}
                selected={isActive}
                sx={{
                  borderRadius: 3,
                  py: 1.2,
                  px: 2,
                  transition: "all 0.2s ease",
                  color: isActive ? "black" : "text.primary",
                  backgroundColor: isActive
                    ? (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                    : "transparent",
                  borderRight: isActive ? "4px solid" : "none",
                  borderRightColor: "secondary.main",
                  boxShadow: isActive
                    ? (theme) =>
                        `0 8px 16px -4px ${alpha(theme.palette.primary.main, 0.3)}`
                    : "none",
                  "&:hover": {
                    backgroundColor: isActive
                      ? (theme) =>
                          `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
                      : (theme) => alpha(theme.palette.primary.main, 0.08),
                  },
                  "& .MuiListItemIcon-root": {
                    color: isActive ? "black" : "inherit",
                    minWidth: 36,
                  },
                  "& .MuiListItemText-primary": {
                    fontWeight: isActive ? 700 : 500,
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* دکمه پایان روز مخصوص اپراتور */}
      {role === "operator" && (
        <Box sx={{ px: 2, pb: 3 }}>
          <Button
            fullWidth
            variant="contained"
            color="warning"
            startIcon={
              closingDay ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <LogOut size={18} />
              )
            }
            onClick={handleOpenConfirmModal}
            disabled={closingDay}
            sx={{
              borderRadius: 3,
              py: 1.5,
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(237, 108, 2, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(237, 108, 2, 0.4)",
              },
            }}
          >
            {closingDay ? "در حال بستن..." : "پایان روز کاری"}
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {/* Drawer موبایل */}
      <Drawer
        anchor="right"
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerClose}
        onTransitionEnd={handleDrawerTransitionEnd}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Drawer دسکتاپ */}
      <Drawer
        anchor="right"
        variant="permanent"
        open
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* مودال تأیید پایان روز */}
      <Dialog
        open={confirmModalOpen}
        onClose={handleCloseConfirmModal}
        maxWidth="xs"
        fullWidth
        dir="rtl"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "warning.main",
          }}
        >
          <AlertTriangle size={24} />
          <Typography variant="h6" fontWeight="700">
            پایان روز کاری
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity="warning" sx={{ mb: 2, fontSize: "0.95rem" }}>
            آیا از بستن روز جاری اطمینان دارید؟
          </Alert>
          <Typography variant="body2" color="text.secondary" paragraph>
            پس از تأیید:
          </Typography>
          <ul style={{ paddingRight: "1.5rem", margin: 0 }}>
            <li>اگر خودرویی داخل پارکینگ باشد، عملیات متوقف می‌شود.</li>
            <li>گزارش روزانه ثبت شده و روز جدید شروع می‌شود.</li>
            <li>امکان ویرایش گزارش بعد از بسته شدن وجود ندارد.</li>
          </ul>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCloseConfirmModal}
            variant="outlined"
            color="inherit"
            sx={{ minWidth: 100 }}
          >
            انصراف
          </Button>
          <Button
            onClick={handleConfirmCloseDay}
            variant="contained"
            color="warning"
            disabled={closingDay}
            sx={{ minWidth: 100 }}
          >
            {closingDay ? <CircularProgress size={20} /> : "تأیید و بستن"}
          </Button>
        </DialogActions>
      </Dialog>

      <NotificationComponent />
    </>
  );
};

export default Sidebar;
