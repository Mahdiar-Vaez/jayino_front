import { GridColDef, GridSortModel } from "@mui/x-data-grid";

export interface ServerTableProps {
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;

  page: number;
  pageSize: number;
  rowCount: number;

  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  sortModel: GridSortModel;
  onSortChange: (model: GridSortModel) => void;
}
