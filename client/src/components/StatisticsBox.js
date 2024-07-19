import React, { useEffect, useState } from "react";
import { Paper, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const StatisticsBox = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({
    totalSales: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics(selectedMonth);
  }, [selectedMonth]);

  const fetchStatistics = async (month) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/statistics/${month}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data) {
        setStatistics({
          totalSales: data.totalSaleAmount || 0,
          totalSoldItems: data.totalSoldItems || 0,
          totalNotSoldItems: data.totalNotSoldItems || 0,
        });
      } else {
        console.error("Unexpected response structure:", data);
      }
    } catch (error) {
      console.error("Error fetching statistics", error);
      setError("Failed to load statistics. Please try again later.");
      setStatistics({
        totalSales: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0,
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
        <Box display="flex" justifyContent="space-between">
          {error ? (
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          ) : (
            <>
              <Typography variant="h6">
                Total Amount of Sale: ${statistics.totalSales}
              </Typography>
              <Typography variant="h6">
                Total Sold Items: {statistics.totalSoldItems}
              </Typography>
              <Typography variant="h6">
                Total Not Sold Items: {statistics.totalNotSoldItems}
              </Typography>
            </>
          )}
        </Box>
      </Paper>
    </motion.div>
  );
};

export default StatisticsBox;
