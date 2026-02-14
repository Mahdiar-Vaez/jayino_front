import {
  Box,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { LogOut, Phone, KeyRound } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import EditableIranPlate from "./LicesePlate";

interface ExitFormProps {
  onSubmit: (data: {
    phone?: string;
    plate?: string;
    exitCode?: string;
  }) => void;
  loading?: boolean;
}

type ExitMethod = "phone" | "plate" | "code";

const ExitForm: React.FC<ExitFormProps> = ({ onSubmit, loading }) => {
  const [method, setMethod] = useState<ExitMethod>("code");
  const [phone, setPhone] = useState("");
  const [exitCode, setExitCode] = useState("");
  const [plate, setPlate] = useState({
    p1: "",
    letter: "",
    p2: "",
    iran: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Refs برای فوکوس
  const phoneRef = useRef<HTMLInputElement>(null);
  const exitCodeRef = useRef<HTMLInputElement>(null);
  const plateContainerRef = useRef<HTMLDivElement>(null);

  const fullPlate =
    plate.p1 && plate.letter && plate.p2 && plate.iran
      ? `${plate.p1}${plate.letter}${plate.p2} ایران ${plate.iran}`
      : "";

  const validate = (): string | null => {
    if (method === "phone" && !/^09\d{9}$/.test(phone))
      return "فرمت شماره موبایل صحیح نیست";
    if (method === "code" && !exitCode.trim())
      return "کد خروج را وارد کنید";
    if (method === "plate" && !fullPlate)
      return "پلاک را کامل وارد کنید";
    return null;
  };

  const focusFirstInvalid = () => {
    if (method === "phone" && !/^09\d{9}$/.test(phone)) {
      phoneRef.current?.focus();
      return true;
    }
    if (method === "code" && !exitCode.trim()) {
      exitCodeRef.current?.focus();
      return true;
    }
    if (method === "plate" && !fullPlate) {
      const firstInput = plateContainerRef.current?.querySelector('input');
      firstInput?.focus();
      return true;
    }
    return false;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      focusFirstInvalid();
      return;
    }

    const payload: any = {};
    if (method === "phone") payload.phone = phone;
    if (method === "code") payload.exitCode = exitCode;
    if (method === "plate") payload.plate = fullPlate;

    onSubmit(payload);
    setError(null);
    // اختیاری: ریست فیلدها
    setPhone("");
    setExitCode("");
    setPlate({ p1: "", letter: "", p2: "", iran: "" });
  };

  // Handler کلید F3
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F3") {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [method, phone, exitCode, plate]);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Typography
        variant="h6"
        color="error"
        display="flex"
        alignItems="center"
        gap={1}
        mb={2}
      >
        <LogOut />
        ثبت خروج خودرو
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <RadioGroup
            row
            value={method}
            onChange={(e) => setMethod(e.target.value as ExitMethod)}
          >
            <FormControlLabel value="phone" control={<Radio />} label="موبایل" />
            <FormControlLabel value="plate" control={<Radio />} label="پلاک" />
            <FormControlLabel value="code" control={<Radio />} label="کد خروج" />
          </RadioGroup>

          {method === "phone" && (
            <TextField
              fullWidth
              label="شماره موبایل"
              value={phone}
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
          )}

          {method === "code" && (
            <TextField
              fullWidth
              label="کد خروج"
              value={exitCode}
              onChange={(e) => setExitCode(e.target.value)}
              inputRef={exitCodeRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyRound />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {method === "plate" && (
            <Box display="flex" justifyContent="center" ref={plateContainerRef}>
              <EditableIranPlate value={plate} onChange={setPlate} />
            </Box>
          )}

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <div>
            <Button
              type="submit"
              variant="contained"
              color="error"
              sx={{ gap: 1 }}
              size="large"
              startIcon={<LogOut />}
              disabled={loading}
            >
              {loading ? "در حال پردازش..." : "ثبت خروج"}
            </Button>
          </div>
        </Stack>
      </form>
    </Paper>
  );
};

export default ExitForm;