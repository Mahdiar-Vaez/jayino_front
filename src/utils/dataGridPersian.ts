// utils/dataGridFaLocale.ts
import {type GridLocaleText } from "@mui/x-data-grid";

export const faIRGridLocale: Partial<GridLocaleText> = {
  // General
  noRowsLabel: "داده‌ای برای نمایش وجود ندارد",
  noResultsOverlayLabel: "نتیجه‌ای پیدا نشد",

  // Toolbar
  toolbarDensity: "تراکم",
  toolbarDensityLabel: "تراکم",
  toolbarDensityCompact: "کم",
  toolbarDensityStandard: "استاندارد",
  toolbarDensityComfortable: "راحت",

  toolbarColumns: "ستون‌ها",
  toolbarColumnsLabel: "انتخاب ستون‌ها",
  toolbarFilters: "فیلترها",
  toolbarFiltersLabel: "نمایش فیلترها",
  toolbarExport: "خروجی",
  toolbarExportLabel: "خروجی",
  toolbarExportCSV: "دانلود CSV",
  toolbarExportPrint: "چاپ",

  // Filters
  filterPanelColumns: "ستون",
  filterPanelOperator: "عملگر",
  filterPanelInputLabel: "مقدار",
  filterPanelInputPlaceholder: "مقدار فیلتر",

  filterOperatorContains: "شامل",
  filterOperatorEquals: "مساوی",
  filterOperatorStartsWith: "شروع با",
  filterOperatorEndsWith: "پایان با",
  filterOperatorIs: "هست",
  filterOperatorNot: "نیست",
  filterOperatorAfter: "بعد از",
  filterOperatorBefore: "قبل از",

  // Column menu
  columnMenuLabel: "منوی ستون",
  columnMenuShowColumns: "نمایش ستون‌ها",
  columnMenuFilter: "فیلتر",
  columnMenuHideColumn: "مخفی کردن ستون",
  columnMenuUnsort: "حذف مرتب‌سازی",
  columnMenuSortAsc: "مرتب‌سازی صعودی",
  columnMenuSortDesc: "مرتب‌سازی نزولی",

  // Pagination
  MuiTablePagination: {
    labelRowsPerPage: "تعداد در هر صفحه",
    labelDisplayedRows: ({ from, to, count }) =>
      `${from}–${to} از ${count !== -1 ? count : `بیش از ${to}`}`,
  },
};
