import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";

const TransactionsTable = ({ selectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions(selectedMonth, searchText, currentPage);
  }, [selectedMonth, searchText, currentPage]);

  const fetchTransactions = async (month, query, page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/transactions?month=${month}&search=${query}&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.rows) {
        setTransactions(data.rows);
      } else {
        console.error("Unexpected data format:", data);
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions", error);
      setError("Failed to load transactions.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <TextField
        label="Search transactions"
        variant="outlined"
        value={searchText}
        onChange={handleSearch}
        fullWidth
        margin="normal"
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Date of Sale</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  {error}
                </TableCell>
              </TableRow>
            ) : transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>{transaction.title || "N/A"}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>${transaction.price}</TableCell>
                  <TableCell>
                    {new Date(transaction.dateOfSale).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="space-between" marginTop="16px">
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
          }
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
        >
          Next
        </Button>
      </Box>
    </motion.div>
  );
};

export default TransactionsTable;
