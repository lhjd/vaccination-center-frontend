import {
  Table,
  Box,
  Button,
  CssBaseline,
  Typography,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Container,
} from "@mui/material";
import { Link } from 'react-router-dom';
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import dayjs from 'dayjs';

export const VaccineRegistrationListing = () => {

  const [status, setStatus] = useState(null);
  const [bookings, setBookings] = useState([]);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetch(`${REACT_APP_BACKEND_URL}/bookings.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setBookings(result);
        }
      );
  }, []);

  useEffect(() => {
    fetch(`${REACT_APP_BACKEND_URL}/bookings.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setBookings(result);
        }
      );
  }, [status]);

  const handleDeleteBooking = (bookingId) => {
    fetch(`${REACT_APP_BACKEND_URL}/bookings/${bookingId}.json`, {
      method: 'DELETE',
    })
      .then(res => {
        if (res.status === 204) {
          setStatus("booking deleted");
        }
      });
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        <Box sx={{ mt: 8 }}>
          <Typography component="h1" variant="h6" style={{ "color": "green" }}>
            {status}
          </Typography>
          <Typography component="h1" variant="h5">
            Active Booking
          </Typography>
          <TableContainer component={Box}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="left">Center Name</TableCell>
                  <TableCell align="left">Start Time</TableCell>
                  <TableCell align="left">&nbsp;</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow
                    key={booking.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {booking.resident_name}
                    </TableCell>
                    <TableCell align="left">{booking.center}</TableCell>
                    <TableCell align="left">
                      {dayjs(booking.date.toString()).format('DD-MMM-YYYY (ddd)')} {dayjs(booking.time.toString()).format('HH:mm')} - Slot {booking.slot_id}
                    </TableCell>
                    <TableCell align="left">
                      <Button component={Link} to={`/bookings/${booking.id}`}>
                        <ModeEditIcon />
                      </Button>
                      <Button onClick={() => handleDeleteBooking(booking.id)}>
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </React.Fragment>
  );
};

