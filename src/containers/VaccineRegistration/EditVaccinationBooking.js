import {
  Box,
  Button, Container, CssBaseline, InputLabel, MenuItem, Select, TextField, Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

export const EditVaccineRegistration = () => {

  const { bookingId } = useParams();

  const [isEdited, setIsEdited] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [centers, setCenters] = useState([]);
  const [slots, setSlots] = useState([]);
  const [residentName, setResidentName] = useState("");
  const [residentNric, setResidentNric] = useState("");
  const [selectedCenterId, setSelectedCenterId] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/centers.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setCenters(result);
        }
      );
  }, []);

  useEffect(() => {

    if (!selectedSlotId) {
      return;
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/slots/${selectedSlotId}.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setSelectedSlot(result);
        }
      );
  }, [selectedSlotId]);

  useEffect(() => {

    if (!selectedCenterId) {
      return;
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/slots.json?center_id=${selectedCenterId}`)
      .then(res => res.json())
      .then(
        (result) => {
          setSlots(result);
        }
      );

  }, [selectedCenterId, isEdited]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/bookings/${bookingId}.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setSelectedCenterId(result.center_id);
          setSelectedSlotId(result.slot_id);
          setResidentName(result.resident_name);
          setResidentNric(result.resident_nric);
        }
      );
  }, [bookingId]);

  const handleRegister = () => {
    setIsEdited(false);
    setStatus(null);
    setError(null);
    const data = { slot_id: selectedSlotId };

    fetch(`${process.env.REACT_APP_BACKEND_URL}/bookings/${bookingId}.json`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(
        (result) => {
          if (result.id) {
            setStatus("edited booking");
            setIsEdited(true);
          } else {
            const errorKey = Object.keys(result)[0];
            setError(`${errorKey} ${result[errorKey]}`);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        <Box
          component="form"
          sx={{
            mt: 8,
          }}
        >
          <Typography component="h1" variant="h6" style={{ "color": "green" }}>
            {status}
          </Typography>
          <Typography component="h1" variant="h6" style={{ "color": "red" }}>
            {error}
          </Typography>
          <Typography component="h1" variant="h5">
            Edit: booking id {bookingId}
          </Typography>
          <TextField
            margin="normal"
            disabled
            fullWidth
            id="nric"
            label="NRIC Number"
            name="NRIC"
            autoComplete="nric"
            value={residentNric}
            sx={{ mb: 2 }}
            autoFocus
          />
          <TextField
            fullWidth
            disabled
            id="name"
            label="Full Name"
            value={residentName}
            sx={{ mb: 2 }}
            name="name"
            autoComplete="name"
          />
          <InputLabel id="vaccineCenterLabel">Vaccine Center</InputLabel>
          <Select
            labelId="vaccineCenterLabel"
            label="Vaccine Center"
            required
            fullWidth
            id="vaccineCenter"
            value={selectedCenterId}
            onChange={(event) => {
              setSelectedCenterId(event.target.value);
              setSelectedSlotId("");
              setSelectedSlot(null);
            }}
            sx={{ mb: 2 }}
          >
            {centers.map((v) => {
              return (
                <MenuItem key={v.id} value={v.id}>
                  {v.name}
                </MenuItem>
              );
            })}
          </Select>
          <Select
            labelId="vaccineSlotLabel"
            label="Slots"
            required
            fullWidth
            id="vaccineSlot"
            value={selectedSlotId}
            onChange={(event) => setSelectedSlotId(event.target.value)}
            sx={{ mb: 2 }}
          >
            {selectedSlot &&
              <MenuItem
                value={selectedSlot.id}
              >
                {dayjs(selectedSlot.date.toString()).format('DD-MMM-YYYY (ddd)')} {dayjs(selectedSlot.start_time.toString()).format('HH:mm')} - Slot {selectedSlot.id} (Current)
              </MenuItem>}
            {slots.map((v) => (
              <MenuItem
                key={v.id} value={v.id}
              >
                {dayjs(v.date.toString()).format('DD-MMM-YYYY (ddd)')} {dayjs(v.start_time.toString()).format('HH:mm')} - Slot {v.id}
              </MenuItem>
            ))}
          </Select>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleRegister}
          >
            Register
          </Button>
        </Box>
      </Container>
    </React.Fragment>
  );
};
