// pages/admin/AdminUsers.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  RefreshCw,
  UserPlus,
  Users,
  Shield,
  Eye,
  UserCog,
} from "lucide-react";
import api from "../../../api/axios";
import UsersTable from "../../../Components/server/tables/UsersDataGrid";
import UserFormModal from "../../../Components/admin/users/UserFormmodals";
import ChangePasswordModal from "../../../Components/admin/users/ChangePassword";
import DeleteConfirmModal from "../../../Components/admin/users/DeleteUsers";
import { useNotification } from "../../../utils/hooks/useNotification";

export default function AdminUsers() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    admin: 0,
    supervisor: 0,
    operator: 0,
  });

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const { showNotification, NotificationComponent } = useNotification();

  // ========== دریافت آمار ==========
  const fetchStats = async () => {
    try {
      const res = await api.get("/users/reports"); // ✅ یک endpoint واحد
      setStats(res.data.data);
    } catch (error) {
      console.error("خطا در دریافت آمار:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ========== مدیریت کاربران ==========
  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setModalMode("create");
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (user: any) => {
    setSelectedUser(user);
    setModalMode("edit");
    setFormModalOpen(true);
  };

  const handleOpenPasswordModal = (user: any) => {
    setSelectedUser(user);
    setPasswordModalOpen(true);
  };

  const handleOpenDeleteModal = (user: any) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleSubmitUser = async (data: any) => {
    console.log("🚀 ~ handleSubmitUser ~ data:", data)
    try {
      if (modalMode === "create") {
        await api.post("/auth/register", data);
        showNotification("کاربر با موفقیت ایجاد شد", "success");
      } else {
        await api.patch(`/users/${selectedUser._id}`, data);
        showNotification("اطلاعات کاربر با موفقیت ویرایش شد", "success");
      }
      setRefreshKey((prev) => prev + 1);
      fetchStats();
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || "خطا در انجام عملیات",
        "error"
      );
      throw error;
    }
  };

  const handleChangePassword = async (userId: string, password: string) => {
    await api.put(`/users/${userId}`, { password });
    showNotification("رمز عبور با موفقیت تغییر کرد", "success");
    setRefreshKey((prev) => prev + 1);
  };

  const handleDeleteUser = async () => {
    try {
     const res= await api.delete(`/users/${selectedUser._id}`);
      console.log("🚀 ~ handleDeleteUser ~ res:", res)
      showNotification("کاربر با موفقیت حذف شد", "success");
      setRefreshKey((prev) => prev + 1);
      setDeleteModalOpen(false);
      fetchStats();
    } catch (error:any) {
      console.log("🚀 ~ handleDeleteUser ~ error:", error)
      showNotification(error.response.data.message|| "خطا در حذف کاربر", "error");
    }
  };

  return (
    <Box sx={{ p: 3, direction: "rtl" }}>
      {/* ========== HEADER ========== */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            مدیریت کاربران
          </Typography>
          <Typography variant="body1" color="text.secondary">
            در این بخش می‌توانید کاربران سیستم را مدیریت کنید. امکان افزودن، ویرایش، تغییر رمز و حذف کاربران وجود دارد.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Tooltip title="به‌روزرسانی">
            <IconButton
              onClick={() => {
                setRefreshKey((prev) => prev + 1);
                fetchStats();
              }}
              sx={{
                bgcolor: "grey.100",
                "&:hover": { bgcolor: "grey.200" },
              }}
            >
              <RefreshCw size={20} />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<UserPlus size={18} />}
            onClick={handleOpenCreateModal}
            sx={{
              px: 3,
              py: 1,
              background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
              boxShadow: "0 4px 6px rgba(33, 150, 243, .2)",
              borderRadius: 2,
            }}
          >
            افزودن کاربر جدید
          </Button>
        </Box>
      </Box>

      {/* ========== کارت‌های آمار ========== */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "کل کاربران", value: stats.total, icon: <Users size={28} />, color: "primary" },
          { label: "مدیران", value: stats.admin, icon: <Shield size={28} />, color: "error" },
          { label: "ناظران", value: stats.supervisor, icon: <Eye size={28} />, color: "warning" },
          { label: "اپراتورها", value: stats.operator, icon: <UserCog size={28} />, color: "info" },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: `${item.color}.main`, width: 56, height: 56 }}>
                  {item.icon}
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {item.value.toLocaleString("fa-IR")}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ========== جدول کاربران ========== */}
      <UsersTable
        refresh={refreshKey}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}   // ✅ مستقیم user کامل دریافت می‌شود
        onPasswordChange={handleOpenPasswordModal}
      />

      {/* ========== مودال‌ها ========== */}
      <UserFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleSubmitUser}
        initialData={selectedUser}
        mode={modalMode}
      />

      <ChangePasswordModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSubmit={handleChangePassword}
        user={selectedUser}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        userName={selectedUser?.fullName || selectedUser?.username}
      />

      <NotificationComponent />
    </Box>
  );
}