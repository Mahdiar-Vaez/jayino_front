import { MenuItem, Select, Stack, FormControl, InputLabel } from "@mui/material";
import { type RevenueType } from "../../../api/admin/admin-reports/report";
import { useEffect } from "react";

// ✅ سال‌های ثابت 1403 تا 1406
const JALALI_YEARS = [1403, 1404, 1405, 1406];

const RevenueChartControls = ({
  type,
  setType,
  year,
  setYear,
}: {
  type: RevenueType;
  setType: (v: RevenueType) => void;
  year: number;
  setYear: (y: number) => void;
}) => {
  // ✅ مقداردهی اولیه سال
  useEffect(() => {
    // اگر سال NaN بود یا خارج از بازه 1403-1406، سال 1404 رو پیش‌فرض قرار بده
    if (isNaN(year) || year < 1403 || year > 1406) {
      setYear(1404);
    }
  }, [year, setYear]);

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="chart-type-label">نوع گزارش</InputLabel>
        <Select
          labelId="chart-type-label"
          value={type}
          onChange={(e) => setType(e.target.value as RevenueType)}
          label="نوع گزارش"
        >
          <MenuItem value="DAILY">📅 درآمد ۷ روز اخیر</MenuItem>
          <MenuItem value="MONTHLY">📆 درآمد ماهانه</MenuItem>
          <MenuItem value="YEARLY">📊 درآمد سالیانه</MenuItem>
        </Select>
      </FormControl>

      {type === "MONTHLY" && (
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="year-select-label">سال</InputLabel>
          <Select
            labelId="year-select-label"
            value={isNaN(year) || year < 1403 || year > 1406 ? 1404 : year}
            onChange={(e) => {
              const selectedYear = Number(e.target.value);
              if (!isNaN(selectedYear) && selectedYear >= 1403 && selectedYear <= 1406) {
                setYear(selectedYear);
              }
            }}
            label="سال"
          >
            {JALALI_YEARS.map((y) => (
              <MenuItem key={y} value={y}>
                {y.toLocaleString("fa-IR")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Stack>
  );
};

export default RevenueChartControls;