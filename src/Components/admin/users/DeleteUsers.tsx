// components/modals/DeleteConfirmModal.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
} from "@mui/material";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { LoadingButton } from "@mui/lab";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userName: string;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  userName,
  loading = false,
}: DeleteConfirmModalProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "error.main" }}>
          <AlertTriangle size={22} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            حذف کاربر
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Box sx={{ 
            display: "flex", 
            justifyContent: "center", 
            mb: 2,
            color: "error.main"
          }}>
            <AlertTriangle size={48} />
          </Box>
          <Typography variant="body1" gutterBottom sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
            آیا از حذف کاربر اطمینان دارید؟
          </Typography>
          <Typography variant="body1" sx={{ 
            bgcolor: "grey.100", 
            p: 1.5, 
            borderRadius: 1,
            mt: 1,
            mb: 2,
            fontWeight: 500
          }}>
            {userName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            این عملیات غیرقابل بازگشت است و تمام اطلاعات کاربر حذف خواهد شد.
          </Typography>
          <Alert 
            severity="error" 
            icon={<AlertTriangle size={18} />}
            sx={{ 
              fontSize: "0.875rem",
              "& .MuiAlert-message": { fontWeight: 500 }
            }}
          >
            توجه: پس از حذف، کاربر دیگر قادر به ورود به سیستم نخواهد بود.
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, justifyContent: "center", gap: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="inherit"
          sx={{ minWidth: 120 }}
        >
          انصراف
        </Button>
        <LoadingButton
          onClick={onConfirm}
          loading={loading}
          variant="contained"
          color="error"
          startIcon={<Trash2 size={18} />}
          sx={{ minWidth: 120 }}
        >
          حذف کاربر
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}