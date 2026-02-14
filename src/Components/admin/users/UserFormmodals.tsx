// components/modals/UserFormModal.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  IconButton,
  Typography,
} from "@mui/material";
import { X, Save, UserPlus, UserCheck, KeyRound } from "lucide-react";
import { LoadingButton } from "@mui/lab";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  mode: "create" | "edit";
}

const roles = [
  { value: "admin", label: "مدیر" },
  { value: "supervisor", label: "ناظر" },
  { value: "operator", label: "اپراتور" },
];

export default function UserFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}: UserFormModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    role: "operator",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        fullName: initialData.fullName || "",
        username: initialData.username || "",
        email: initialData.email || "",
        role: initialData.role || "operator",
        password: "",
        confirmPassword: "",
      });
    } else {
      setFormData({
        fullName: "",
        username: "",
        email: "",
        role: "operator",
        password: "",
        confirmPassword: "",
      });
    }
    setErrors({});
  }, [initialData, mode, open]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.username.trim()) {
      newErrors.username = "نام کاربری اجباری است";
    }
    if (mode === "create" && !formData.password) {
      newErrors.password = "رمز عبور اجباری است";
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "رمز عبور و تکرار آن مطابقت ندارند";
    }
    if (formData.email && !/^[\w.+\-]+@gmail\.com$/.test(formData.email)) {
      newErrors.email = "ایمیل باید @gmail.com باشد";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = { ...formData };
      delete submitData.confirmPassword;
      
      if (mode === "edit" && !submitData.password) {
        delete submitData.password;
      }

      await onSubmit(submitData);
      onClose();
    } catch (error: any) {
      if (error.response?.data?.message?.includes("نام کاربری")) {
        setErrors({ username: "این نام کاربری قبلاً استفاده شده است" });
      } else if (error.response?.data?.message?.includes("ایمیل")) {
        setErrors({ email: "این ایمیل قبلاً استفاده شده است" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      dir="rtl"
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2.5, 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        borderBottom: "1px solid",
        borderColor: "divider"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {mode === "create" ? <UserPlus size={22} /> : <UserCheck size={22} />}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {mode === "create" ? "افزودن کاربر جدید" : "ویرایش کاربر"}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Stack spacing={3}>
          <TextField
            label="نام و نام خانوادگی"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            fullWidth
            size="medium"
            dir="rtl"
          />
          
          <TextField
            label="نام کاربری"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            size="medium"
            required
            error={!!errors.username}
            helperText={errors.username}
            dir="rtl"
          />
          
          <TextField
            label="ایمیل"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            size="medium"
            placeholder="example@gmail.com"
            error={!!errors.email}
            helperText={errors.email}
            dir="ltr"
          />
          
          <FormControl fullWidth size="medium">
            <InputLabel>نقش کاربر</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="نقش کاربر"
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {mode === "create" && (
            <>
              <TextField
                label="رمز عبور"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                size="medium"
                required
                error={!!errors.password}
                helperText={errors.password}
                dir="ltr"
              />
              
              <TextField
                label="تکرار رمز عبور"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                size="medium"
                required
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                dir="ltr"
              />
            </>
          )}

          {mode === "edit" && (
            <Box sx={{ 
              bgcolor: "primary.50", 
              p: 2.5, 
              borderRadius: 2,
              border: "1px solid",
              borderColor: "primary.200"
            }}>
              <Alert 
                severity="info" 
                icon={<KeyRound size={20} />}
                sx={{ 
                  "& .MuiAlert-message": { 
                    fontSize: "0.9rem",
                    fontWeight: 500 
                  } 
                }}
              >
                برای تغییر رمز عبور از دکمه "تغییر رمز عبور" در لیست کاربران استفاده کنید.
              </Alert>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="inherit"
          sx={{ minWidth: 100 }}
        >
          انصراف
        </Button>
        <LoadingButton
          onClick={handleSubmit}
          loading={loading}
          variant="contained"
          color="primary"
          startIcon={<Save size={18} />}
          sx={{ minWidth: 140 }}
        >
          {mode === "create" ? "ایجاد کاربر" : "ذخیره تغییرات"}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}