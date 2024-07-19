import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Paper } from "@mui/material";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const BarChart = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChartData(selectedMonth);
  }, [selectedMonth]);

  const fetchChartData = async (month) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/bar-chart/${month}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      if (Array.isArray(data) && data.length > 0) {
        const processedData = data.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {});

        setChartData({
          labels: Object.keys(processedData),
          datasets: [
            {
              label: "Number of Items",
              data: Object.values(processedData),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } else {
        console.warn("No data found or data is not in expected format:", data);
        setChartData({ labels: [], datasets: [] });
      }
    } catch (error) {
      console.error("Error fetching chart data", error);
      setError("Failed to load chart data.");
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <Bar data={chartData} />
        )}
      </Paper>
    </motion.div>
  );
};

export default BarChart;
