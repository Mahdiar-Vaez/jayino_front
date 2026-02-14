// components/modals/ChangePasswordModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  IconButton,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import { X, KeyRound, Save } from "lucide-react";
import { LoadingButton } from "@mui/lab";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userId: string, password: string) => Promise<void>;
  user: any;
}

export default function ChangePasswordModal({
  open,
  onClose,
  onSubmit,
  user,
}: ChangePasswordModalProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = async () => {
    const newErrors: any = {};

    if (!password) {
      newErrors.password = "رمز عبور اجباری است";
    } else if (password.length < 6) {
      newErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "رمز عبور و تکرار آن مطابقت ندارند";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(user._id, password);
      setPassword("");
      setConfirmPassword("");
      setErrors({});
      onClose();
    } catch (error) {
      // Error handling
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
        sx: { borderRadius: 2 }
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
          <KeyRound size={22} color="#ed6c02" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            تغییر رمز عبور
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box sx={{ 
            bgcolor: "grey.50", 
            p: 2, 
            borderRadius: 2,
            border: "1px solid",
            borderColor: "grey.200"
          }}>
            <Typography variant="subtitle2" gutterBottom>
              کاربر: <Box component="span" sx={{ fontWeight: 700 }}>{user?.fullName || user?.username}</Box>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              نام کاربری: {user?.username}
            </Typography>
          </Box>

          <Alert 
            severity="warning" 
            icon={<KeyRound size={18} />}
            sx={{ 
              fontSize: "0.875rem",
              "& .MuiAlert-message": { fontWeight: 500 }
            }}
          >
            پس از تغییر رمز عبور، کاربر با رمز جدید وارد خواهد شد.
          </Alert>
          
          <TextField
            label="رمز عبور جدید"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            size="medium"
            required
            error={!!errors.password}
            helperText={errors.password}
            dir="ltr"
          />
          
          <TextField
            label="تکرار رمز عبور جدید"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            size="medium"
            required
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            dir="ltr"
          />
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
          color="warning"
          startIcon={<Save size={18} />}
          sx={{ minWidth: 140 }}
        >
          تغییر رمز عبور
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}