import React, { useState } from "react";
import { Container, Select, MenuItem, Box, Typography } from "@mui/material";
import TransactionsTable from "../TransactionsTable";
import StatisticsBox from "../StatisticsBox";
import BarChart from "../BarChart";

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("2024-03");

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="16px"
      >
        <Typography variant="h4">Transactions Dashboard</Typography>
        <Select
          value={selectedMonth}
          onChange={handleMonthChange}
          variant="outlined"
        >
          {[
            "2024-01",
            "2024-02",
            "2024-03",
            "2024-04",
            "2024-05",
            "2024-06",
            "2024-07",
            "2024-08",
            "2024-09",
            "2024-10",
            "2024-11",
            "2024-12",
          ].map((month) => (
            <MenuItem key={month} value={month}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <StatisticsBox selectedMonth={selectedMonth} />
      <TransactionsTable selectedMonth={selectedMonth} />
      <BarChart selectedMonth={selectedMonth} />
    </Container>
  );
};

export default Dashboard;
