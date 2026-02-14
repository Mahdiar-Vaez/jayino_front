import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Divider,
} from "@mui/material";
import { CreditCard, Banknote } from "lucide-react";
import { useState, useEffect } from "react";

type PaymentMethod = "CASH" | "CARD";

interface CostHandlerProps {
  open: boolean;
  cost: number;
  sessionId: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (data: {
    sessionId: string;
    paymentMethod: PaymentMethod;
  }) => void;
}

export default function CostHandler({
  open,
  cost,
  sessionId,
  loading,
  onClose,
  onConfirm,
}: CostHandlerProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CARD");

  const handleConfirm = () => {
    onConfirm({ sessionId, paymentMethod });
  };

  // F3 در حالت باز بودن دیالوگ
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F3") {
        e.preventDefault();
        handleConfirm();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, paymentMethod, sessionId, loading]); // loading برای جلوگیری از ثبت مجدد در حال ارسال

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>💰 محاسبه هزینه خروج</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body1">مبلغ قابل پرداخت:</Typography>
          <Typography
            variant="h4"
            color="error"
            fontWeight="bold"
            textAlign="center"
          >
            {cost.toLocaleString()} تومان
          </Typography>

          <Divider />

          <Typography variant="body2" color="text.secondary">
            روش پرداخت را انتخاب کنید
          </Typography>

          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          >
            <FormControlLabel
              value="CASH"
              control={<Radio />}
              label={
                <Stack direction="row" gap={1} alignItems="center">
                  <Banknote size={18} />
                  نقدی
                </Stack>
              }
            />
            <FormControlLabel
              value="CARD"
              control={<Radio />}
              label={
                <Stack direction="row" gap={1} alignItems="center">
                  <CreditCard size={18} />
                  کارت بانکی
                </Stack>
              }
            />
          </RadioGroup>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          انصراف
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="success"
          disabled={loading}
        >
          {loading ? "در حال ثبت..." : "تأیید پرداخت"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}