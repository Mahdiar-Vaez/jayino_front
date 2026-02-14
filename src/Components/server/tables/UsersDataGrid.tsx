// components/server/tables/UsersDataGrid.tsx
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import api from "../../../api/axios";
import ServerDataGrid from "../DataGrid";
import { userColumns } from "../columns"; // مسیر را مطابق پروژه خود اصلاح کنید

interface UsersTableProps {
  refresh: number;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;   // ✅ کل user
  onPasswordChange: (user: any) => void;
}

export default function UsersTable({
  refresh,
  onEdit,
  onDelete,
  onPasswordChange,
}: UsersTableProps) {
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const sort =
        sortModel.length > 0
          ? `${sortModel[0].sort === "desc" ? "-" : ""}${sortModel[0].field}`
          : "-createdAt";

      const res = await api.get("/users", {
        params: {
          page: page + 1,
          limit: pageSize,
          sort,
        },
      });

      setRows(res.data.data);
      setRowCount(res.data.count);
    } catch (error) {
      console.error("خطا در دریافت کاربران:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, sortModel, refresh]);

  return (
    <Box sx={{ height: 600, width: "100%", direction: "rtl" }}>
      <ServerDataGrid
        rows={rows}
        columns={userColumns(onEdit, onDelete, onPasswordChange)}
        loading={loading}
        page={page}
        pageSize={pageSize}
        rowCount={rowCount}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => setPageSize(s)}
        sortModel={sortModel}
        onSortChange={setSortModel}
      />
    </Box>
  );
}