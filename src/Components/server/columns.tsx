// columns/parkingSessionColumns.ts
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Chip, IconButton, Stack, Tooltip, Typography ,Box} from "@mui/material";
import { Edit, Trash2, KeyRound, DollarSign, Car, Truck, Bus, User, Clock } from "lucide-react";


export const parkingSessionColumns: GridColDef[] = [
  {
    field: "enteredBy",
    headerName: "وارد شده توسط",
    flex: 1,
    headerAlign: "left",
    align: "right",
    valueGetter:(_,row)=>row?.enteredBy?.fullName || "-"
  },
    {
    field: "exitedBy",
    headerName: "خارج شده توسط",
    flex: 1,
    headerAlign: "left",
    align: "right",
    valueGetter:(_,row)=>row?.exitedBy?.fullName || "-"
  },

  {
    field: "plateNumber",
    headerName: "پلاک",
    headerAlign: "left",
    align: "right",
    flex: 1,
    valueGetter: (_, row) => row?.vehicle?.plateNumber || "-",
  },

  {
    field: "phoneNumber",
    headerName: "شماره تماس",
    headerAlign: "left",
    align: "right",
    flex: 1,
    valueGetter: (_, row) => row?.customer?.phoneNumber || "-",
  },

  {
    headerAlign: "left",
    align: "right",
    field: "carType",
    filterable: false,
    headerName: "نوع خودرو",
    flex: 1,
    renderCell: (params: GridRenderCellParams<string>) => {
      if (params.value === "CAR") {
        return (
          <Chip
            label="سواری"
            color="info"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      }

      if (params.value === "TRUCK") {
        return (
          <Chip
            label="وانت"
            color="info"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      }
      else {
            return (
          <Chip
            label="اتوبوس/کامیون"
            color="info"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      }

      return <span>-</span>;
    },
  },

  // ✅ وضعیت داخل / خارج
  {
    field: "status",
    headerName: "وضعیت خودرو",
    flex: 1,
    filterable: false,
    headerAlign: "left",
    align: "right",
    renderCell: (params: GridRenderCellParams<string>) => {
      if (params.value === "IN") {
        return (
          <Chip
            label="داخل"
            color="info"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      }

      if (params.value === "OUT") {
        return (
          <Chip
            label="خارج"
            color="warning"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      }

      return <span>-</span>;
    },
  },
 {
    field: "isExpired",
    headerAlign: "left",
    filterable: false,
    align: "right",
    headerName: " انقضا",
    
    renderCell: (params: GridRenderCellParams<string>) => {
      if (!params.value) {
        return (
          <Chip
            label=" معتبر"
            color="success"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      }

  else
{        return (
          <Chip
            label=" منقضی شده"
            color="error"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      }

    },
  },
  // ✅ وضعیت پرداخت
  {
    field: "paymentMethod",
    headerAlign: "left",
    filterable: false,
    align: "right",
    headerName: "وضعیت پرداخت",
    flex: 1,
    renderCell: (params: GridRenderCellParams<string>) => {
      if (params.value === "CASH") {
        return (
          <Chip
            label="نقدی"
            color="primary"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      }

      if (params.value === "CARD") {
        return (
          <Chip
            label="کارت "
            color="secondary"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      }

      return <span>-</span>;
    },
  },
   {
    field: "paymentStatus",
    headerAlign: "left",
    filterable: false,
    align: "right",
    headerName: "وضعیت پرداخت",
    renderCell: (params: GridRenderCellParams<string>) => {
      if (params.value === "PAID") {
        return (
          <Chip
            label="پرداخت شده"
            color="success"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      }

      if (params.value === "UNPAID") {
        return (
          <Chip
            label="پرداخت نشده"
            color="error"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      }

      return <span>-</span>;
    },
  },


  // ✅ هزینه فقط بعد از خروج
  {
    field: "cost",
    headerAlign: "left",
    align: "right",
    headerName: "هزینه (تومان)",
    valueGetter: (_, row) => {
      if (row?.status !== "OUT") return "-";
      return row?.cost ? row.cost.toLocaleString("fa-IR") : "-";
    },
  },

  {
    field: "entryTime",
    headerName: "زمان ورود",
    headerAlign: "left",
    align: "right",
    flex: 1,
        filterable:false,

    width:200,
    valueFormatter: (value) =>
      value ? new Date(value).toLocaleString("fa-IR") : "-",
  },

  {
    width:200,
    filterable:false,
    headerAlign: "left",
    align: "right",
    field: "exitTime",
    headerName: "زمان خروج",
    flex: 1,
    valueFormatter: (value) =>
      value ? new Date(value).toLocaleString("fa-IR") : "-",
  },
];
// components/columns/userColumns.tsx

// components/columns/userColumns.tsx


const roleColors = {
  admin: "error",
  superAdmin: "success",
  supervisor: "warning",
  operator: "info",
} as const;

const roleLabels = {
  admin: "مدیر",
  supervisor: "ناظر",
  operator: "اپراتور",
  superAdmin: "مدیر ارشد",
} as const;

export const userColumns = (
  handleEdit: (user: any) => void,
  handleDelete: (user: any) => void,
  handleChangePassword: (user: any) => void,
  currentUserRole?: string
): GridColDef[] => [
  {
    field: "rowIndex",
    headerName: "ردیف",
    width: 70,
    headerAlign: "center",
    align: "center",
    filterable: false,
    sortable: false,
    valueGetter: (params) => {
      const index = params?.api?.getRowIndexRelativeToVisibleRows(params.id);
      return index !== undefined ? index + 1 : "";
    },
  },
  {
    field: "fullName",
    headerName: "نام و نام خانوادگی",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
    minWidth: 150,
  },
  {
    field: "username",
    headerName: "نام کاربری",
    flex: 1,
    headerAlign: "center",
    align: "center",
    minWidth: 120,
  },
  {
    field: "email",
    headerName: "ایمیل",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
    minWidth: 180,
    renderCell: (params: GridRenderCellParams) => (
      <span dir="ltr">{params.value || "-"}</span>
    ),
  },
  {
    field: "role",
    headerName: "نقش",
    filterable: false,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    minWidth: 100,
    renderCell: (params: GridRenderCellParams) => (
      <Chip
        label={roleLabels[params.value as keyof typeof roleLabels]}
        color={roleColors[params.value as keyof typeof roleColors] as any}
        size="small"
        sx={{ fontWeight: 600, minWidth: 80 }}
      />
    ),
  },
  {
    field: "createdAt",
    headerName: "تاریخ عضویت",
    flex: 1.2,
    filterable: false,
    headerAlign: "center",
    align: "center",
    minWidth: 150,
    valueFormatter: (value) =>
      value ? new Date(value).toLocaleDateString("fa-IR") : "-",
  },
  {
    field: "actions",
    headerName: "عملیات",
    flex: 1.2,
    headerAlign: "center",
    align: "center",
    sortable: false,
    filterable: false,
    minWidth: 180,
    renderCell: (params: GridRenderCellParams) => {
      // اگر کاربر فعلی superAdmin نیست، دکمه‌ها نمایش داده نشود
      if (currentUserRole !== "superAdmin") {
        return (
          <Typography variant="caption" color="text.secondary">
            دسترسی ندارید
          </Typography>
        );
      }

      return (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="ویرایش">
            <IconButton
              size="small"
              sx={{ color: "#1976d2" }}
              onClick={() => handleEdit(params.row)}
            >
              <Edit size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="تغییر رمز عبور">
            <IconButton
              size="small"
              sx={{ color: "#ed6c02" }}
              onClick={() => handleChangePassword(params.row)}
            >
              <KeyRound size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="حذف">
            <IconButton
              size="small"
              sx={{ color: "#d32f2f" }}
              onClick={() => handleDelete(params.row)}
            >
              <Trash2 size={18} />
            </IconButton>
          </Tooltip>
        </Stack>
      );
    },
  },
];


const vehicleLabels = {
  CAR: "سواری",
  TRUCK: "وانت",
  BUS: "اتوبوس/کامیون",
};

export const dailyReportColumns: GridColDef[] = [
  {
    field: "rowIndex",
    headerName: "ردیف",
    width: 70,
    headerAlign: "center",
    align: "center",
    filterable: false,
    sortable: false,
    valueGetter: (params) => {
      const index = params?.api?.getRowIndexRelativeToVisibleRows(params.id);
      return index !== undefined ? index + 1 : "";
    },
  },
  {
    field: "persianDate",
    headerName: "تاریخ",
    flex: 1,
    minWidth: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "totalIncome",
    headerName: "درآمد کل (تومان)",
    flex: 1,
    minWidth: 150,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) => value?.toLocaleString("fa-IR") + " تومان",
  },
  {
    field: "cashIncome",
    headerName: "نقدی",
    flex: 0.8,
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) => value?.toLocaleString("fa-IR") + " تومان",
  },
  {
    field: "cardIncome",
    headerName: "کارتی",
    flex: 0.8,
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) => value?.toLocaleString("fa-IR") + " تومان",
  },

  {
    field: "totalExits",
    headerName: "خروج",
    flex: 0.6,
    minWidth: 80,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) => value?.toLocaleString("fa-IR"),
  },
  {
    field: "vehicleBreakdown",
    headerName: "تفکیک خودروها",
    flex: 1.5,
    minWidth: 200,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const breakdown = params.value || {};
      const parts = Object.entries(breakdown)
        .filter(([_, count]) => count > 0)
        .map(([key, count]) => `${vehicleLabels[key as keyof typeof vehicleLabels]}: ${(count as number).toLocaleString("fa-IR")}`);
      return <Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}}   >{parts.join("، ")}</Box>;
    },
  },
  {
    field: "closedBy",
    headerName: "بسته شده توسط",
    flex: 1,
    minWidth: 150,
    headerAlign: "center",
    align: "center",
    valueGetter: (_, row) => row?.closedBy?.fullName || "-",

}  ,
  {
    field: "closedAt",
    headerName: "زمان بسته شدن",
    flex: 1,
    minWidth: 150,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) => (value ? new Date(value).toLocaleString("fa-IR") : "-"),
  },
];