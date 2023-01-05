import React, { useState, useEffect, memo } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Pagination } from "@mui/material";

import TableHeader from "./TableHeader";

import {
  getComparator,
  stableSort,
  getTableHeaders,
  getTableContent,
} from "./tableConfig";

import {
  ACTION_TYPE,
  APPLICATION_ID,
  APPLICATION_TYPE,
  CREATION_TIMESTAMP,
  LOG_ID,
} from "../../constants/tableColumns";

const TableComponent = ({ tableData }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [headerCells, setHeaderCells] = useState([]);
  const [tableContent, setTableContent] = useState([]);

  useEffect(() => {
    const headers = getTableHeaders(tableData[0]);
    const tableContent = getTableContent(tableData);
    setHeaderCells(headers);
    setTableContent(tableContent);
  }, [tableData]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableContent.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <TableHeader
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={tableContent.length}
              headerCells={headerCells}
            />
            <TableBody>
              {stableSort(tableContent, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover key={row.logId}>
                      <TableCell padding="normal">
                        {row[LOG_ID] ? row[LOG_ID] : "-"}
                      </TableCell>
                      <TableCell padding="normal">
                        {row[APPLICATION_ID] ? row[APPLICATION_ID] : "-"}
                      </TableCell>
                      <TableCell padding="normal">
                        {row[APPLICATION_TYPE] ? row[APPLICATION_TYPE] : "-"}
                      </TableCell>
                      <TableCell padding="normal">
                        {row[ACTION_TYPE] ? row[ACTION_TYPE] : "-"}
                      </TableCell>
                      <TableCell padding="normal">
                        {row[CREATION_TIMESTAMP]
                          ? row[CREATION_TIMESTAMP]
                          : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(tableContent.length / 10)}
          variant="outlined"
          shape="rounded"
          page={page + 1}
          sx={{ p: 2 }}
          onChange={handleChangePage}
        />
      </Paper>
    </Box>
  );
};

export default memo(TableComponent);
