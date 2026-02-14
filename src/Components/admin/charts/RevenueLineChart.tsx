import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import { Typography, Box } from "@mui/material";

// ✅ تبدیل عدد به فارسی با جداکننده هزارگان (مثال: ۱۲٬۳۴۵٬۶۷۸)
export const toPersianNumberWithCommas = (num: number): string => {
  const parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '،'); // جداکننده فارسی (٬)
  return parts.join('.').replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);
};


// ✅ فرمت محور Y (با جداکننده هزارگان و ارقام فارسی)
const formatYAxis = (value: number) => {
  return toPersianNumberWithCommas(value);
};

// ✅ کامپوننت Tooltip سفارشی با جداکننده هزارگان و ارقام فارسی
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: "white",
          p: 2,
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: 3,
          direction: "rtl",
        }}
      >
        <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
          {label}
        </Typography>
        <Typography variant="body2" color="primary">
          💰 درآمد: {toPersianNumberWithCommas(payload[0].value)} تومان
        </Typography>
      </Box>
    );
  }
  return null;
};

const RevenueLineChart = ({ data }: any) => {
  if (!data || data.length === 0) {
    return (
      <Typography align="center" sx={{ py: 4, color: "text.secondary" }}>
        🚫 داده‌ای برای نمایش وجود ندارد
      </Typography>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        
        <XAxis 
          dataKey="label" 
          tick={{ fill: "#666", fontSize: 11 }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={100}
        />
        
        <YAxis 
          tickFormatter={formatYAxis}
          tick={{ fill: "#666", fontSize: 12 }}
          label={{ 
            value: "مبلغ (تومان)", 
            angle: -90, 
            position: "insideLeft",
            style: { textAnchor: "middle", fill: "#666", fontSize: 12 }
          }}
        />
        
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: 20 }} />
        
        <Line
          type="monotone"
          dataKey="total"
          name="درآمد"
          stroke="#1976d2"
          strokeWidth={3}
          dot={{ r: 5, fill: "#1976d2", strokeWidth: 0 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueLineChart;