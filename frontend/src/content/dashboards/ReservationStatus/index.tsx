import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Grid,
} from "@mui/material";

import { useState } from "react";
import axios from "axios";
import BookingStatus from "./BookingStatus";

function ReservationStatusPage() {
  const [studentId, setStudentId] = useState("");
  const [data, setData] = useState([]);

  const baseAPIUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `${baseAPIUrl}/api/reservations/by-student?studentId=${studentId}`
      );
      setData(res.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  return (
    <Grid
      sx={{ px: 4, mt: 2 }}
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      spacing={4}
    >
      <Grid item xs={12}>
        <BookingStatus />
      </Grid>
    </Grid>
  );
}

export default ReservationStatusPage;
