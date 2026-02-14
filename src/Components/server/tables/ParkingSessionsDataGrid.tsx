import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { parkingSessionColumns } from "../columns";
import { Box } from "@mui/material";
import ServerDataGrid from "../DataGrid";

export default function ParkingSessions({refresh}:{refresh?:number}) {
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    const sort =
      sortModel.length > 0
        ? `${sortModel[0].sort === "desc" ? "-" : ""}${sortModel[0].field}`
        : "-createdAt";

    const res = await api.get("/parking", {
      params: {
        page: page + 1,
        limit: pageSize,
        sort,
        populate: "customer,vehicle",
      },
    });
    console.log("🚀 ~ fetchData ~ res:", res)

    setRows(res.data.data);
    setRowCount(res.data.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, sortModel,refresh]);

  return (
    <Box sx={{ height: 600, direction: "rtl" }}>
     <ServerDataGrid
  rows={rows}
  columns={parkingSessionColumns}
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