import {
  Button,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  Box,
  Checkbox,
  FormHelperText,
} from "@mui/material";
import { Phone, Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import EditableIranPlate from "./LicesePlate";
import { type VehicleEntryBody } from "../../api/vehicleEntry";

interface EntryFormProps {
  onSubmit: (data: VehicleEntryBody) => void;
  loading?: boolean;
}

const EntryForm: React.FC<EntryFormProps> = ({ onSubmit, loading }) => {
  const [phone, setPhone] = useState("");
  const [submitPlate, setSubmitPlate] = useState(false);
  const [plate, setPlate] = useState({
    p1: "",
    letter: "",
    p2: "",
    iran: "",
  });
  const [carType, setCarType] = useState<VehicleEntryBody["carType"]>("car");
  const [errors, setErrors] = useState<{ phone?: string; plate?: string }>({});

  const phoneRef = useRef<HTMLInputElement>(null);
  const plateContainerRef = useRef<HTMLDivElement>(null);
  const fullPlate =
    plate.p1 && plate.letter && plate.p2 && plate.iran
      ? `${plate.p1}${plate.letter}${plate.p2} ایران ${plate.iran}`
      : "";

  // اعتبارسنجی
  const validate = () => {
    const newErrors: typeof errors = {};

    if (!phone.trim()) {
      newErrors.phone = "شماره موبایل الزامی است";
    } else if (!/^09\d{9}$/.test(phone)) {
      newErrors.phone = "فرمت شماره موبایل صحیح نیست";
    }

    // برای اتوبوس/کامیون پلاک اجباری است
    if (carType === "bus") {
      if (!fullPlate) {
        newErrors.plate = "برای اتوبوس و کامیون شماره پلاک الزامی است";
      }
    } else {
      // برای سایر خودروها اگر چک‌باکس فعال است پلاک باید کامل باشد
      if (submitPlate && !fullPlate) {
        newErrors.plate = "پلاک را کامل وارد کنید";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // فوکوس روی اولین فیلد نامعتبر
  const focusFirstInvalid = () => {
    if (!phone.trim() || !/^09\d{9}$/.test(phone)) {
      phoneRef.current?.focus();
      return true;
    }

    if (carType === "bus" && !fullPlate) {
      if (!submitPlate) {
        setSubmitPlate(true);
        // بعد از فعال‌سازی، فوکوس را به پلاک می‌دهیم
        setTimeout(() => {
          const firstInput = plateContainerRef.current?.querySelector('input');
          firstInput?.focus();
        }, 100);
      } else {
        const firstInput = plateContainerRef.current?.querySelector('input');
        firstInput?.focus();
      }
      return true;
    }

    if (submitPlate && !fullPlate) {
      const firstInput = plateContainerRef.current?.querySelector('input');
      firstInput?.focus();
      return true;
    }

    return false;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!validate()) {
      focusFirstInvalid();
      return;
    }

    const body: VehicleEntryBody = {
      phoneNumber: phone,
      carType,
    };
    if (fullPlate) {
      body.plateNumber = fullPlate;
    }

    onSubmit(body);

    // ریست فیلدها
    setPhone("");
    setPlate({ p1: "", letter: "", p2: "", iran: "" });
    setSubmitPlate(false);
    setCarType("car");
  };

  // کلید F3
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F3") {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phone, submitPlate, plate, carType]);

  // اگر نوع اتوبوس انتخاب شد، چک‌باکس فعال شود
  useEffect(() => {
    if (carType === "bus") {
      setSubmitPlate(true);
    }
  }, [carType]);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" color="primary" gutterBottom>
        ثبت ورود خودرو
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        شماره موبایل الزامی است. ثبت پلاک اختیاری می‌باشد.
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="شماره موبایل *"
            value={phone}
            error={!!errors.phone}
            helperText={errors.phone}
            onChange={(e) => setPhone(e.target.value)}
            inputRef={phoneRef}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            fullWidth
            label="نوع خودرو *"
            value={carType}
            onChange={(e) => setCarType(e.target.value as any)}
            SelectProps={{ native: true }}
          >
            <option value="car">سواری</option>
            <option value="truck">وانت</option>
            <option value="bus">اتوبوس/کامیون</option>
          </TextField>

          <Box display="flex" alignItems="center" gap={1}>
            <Checkbox
              checked={submitPlate}
              onChange={(e) => {
                if (carType !== "bus") {
                  setSubmitPlate(e.target.checked);
                }
              }}
              disabled={carType === "bus"}
            />
            <Typography>ثبت پلاک</Typography>
          </Box>

          {(submitPlate || carType === "bus") && (
            <Box display="flex" justifyContent="center" ref={plateContainerRef}>
              <EditableIranPlate value={plate} onChange={setPlate} />
            </Box>
          )}

          {errors.plate && (
            <FormHelperText error sx={{ textAlign: "center" }}>
              {errors.plate}
            </FormHelperText>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ gap: 1 }}
            startIcon={<Send />}
            disabled={loading}
          >
            {loading ? "در حال ارسال..." : "ثبت ورود"}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default EntryForm;