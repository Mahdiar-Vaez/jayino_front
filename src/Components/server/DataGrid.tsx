// components/Table/ServerDataGrid.tsx
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { type ServerTableProps } from "../../types/tableTypes";
import { faIRGridLocale } from "../../utils/dataGridPersian";

export default function ServerDataGrid({
  rows,
  columns,
  loading,

  page,
  pageSize,
  rowCount,

  onPageChange,
  onPageSizeChange,

  sortModel,
  onSortChange,
}: ServerTableProps) {
  return (
    <Box
      sx={{
        width: "100%",
        direction: "rtl",
        "& .MuiDataGrid-root": {
          direction: "rtl",
        },
        "& .MuiDataGrid-columnHeaders": {
          direction: "rtl",
        },
        "& .MuiDataGrid-virtualScroller": {
          direction: "rtl",
        },
        "& .MuiDataGrid-footerContainer": {
          direction: "rtl",
        },
        "& .MuiTablePagination-root": {
          direction: "rtl",
        },
      }}
    >
    <DataGrid
  rows={rows}
  columns={columns}
  loading={loading}
  localeText={faIRGridLocale}
  getRowId={(row) => row?._id}

  paginationMode="server"
  sortingMode="server"

  paginationModel={{
    page,
    pageSize,
  }}
  onPaginationModelChange={(model) => {
    onPageChange(model.page);
    onPageSizeChange(model.pageSize);
  }}

  rowCount={rowCount}

  sortModel={sortModel}
  onSortModelChange={onSortChange}

  pageSizeOptions={[10, 25, 50]}
  disableRowSelectionOnClick
  autoHeight/>
    </Box>
  );
}
