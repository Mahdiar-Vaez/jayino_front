// pages/TestDataGrid.tsx
import { useEffect, useState } from "react";
import ServerDataGrid from "./DataGrid";
import { mockSessions } from "./mockData"; 
import { parkingSessionsColumns } from "./columns"; 
import { type GridSortModel } from "@mui/x-data-grid";

export default function TestDataGrid() {
  const [rows, setRows] = useState<any[]>([]);
  const [rowCount, setRowCount] = useState(mockSessions.length);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      let data = [...mockSessions];

      // ✅ شبیه‌سازی sort سروری
      if (sortModel.length > 0) {
        const { field, sort } = sortModel[0];
        data.sort((a: any, b: any) => {
          if (a[field] < b[field]) return sort === "asc" ? -1 : 1;
          if (a[field] > b[field]) return sort === "asc" ? 1 : -1;
          return 0;
        });
      }

      // ✅ شبیه‌سازی pagination سروری
      const start = page * pageSize;
      const end = start + pageSize;

      setRows(data.slice(start, end));
      setLoading(false);
    }, 600); // delay فیک برای حس واقعی API
  }, [page, pageSize, sortModel]);

  return (
    <ServerDataGrid
      rows={rows}
      columns={parkingSessionsColumns}
      loading={loading}
      page={page}
      pageSize={pageSize}
      rowCount={rowCount}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      sortModel={sortModel}
      onSortChange={setSortModel}
    />
  );
}