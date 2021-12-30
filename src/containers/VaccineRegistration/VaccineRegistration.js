import {
  Box,
  Button, Container, CssBaseline, InputLabel, MenuItem, Select, TextField, Typography
} from "@mui/material";
import dayjs from 'dayjs';
import React, { useEffect, useState } from "react";


export const VaccineRegistration = () => {

  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [centers, setCenters] = useState([]);
  const [nric, setNric] = useState("");
  const [selectedCenterId, setSelectedCenterId] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [slots, setSlots] = useState([]);

  const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetch(`${REACT_APP_BACKEND_URL}/centers.json`)
      .then(res => res.json())
      .then(
        (result) => {
          setCenters(result);
          setSelectedCenterId(result[0].id);
        }
      );
  }, []);

  useEffect(() => {

    if (!selectedCenterId) {
      return;
    }

    fetch(`${REACT_APP_BACKEND_URL}/slots.json?center_id=${selectedCenterId}`)
      .then(res => res.json())
      .then(
        (result) => {
          setSlots(result);
          setSelectedSlotId(result[0].id);
        }
      );

  }, [selectedCenterId]);


  const handleRegister = () => {
    setStatus(null);
    setError(null);
    if (!nric) {
      setError("Please fill in NRIC");
      return;
    }
    const data = { resident_nric: nric, slot_id: selectedSlotId };

    fetch(`${REACT_APP_BACKEND_URL}/bookings.json`, {
      method: 'POST',
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
            setStatus("added booking");
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
            Book a slot
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="nric"
            label="NRIC Number"
            name="NRIC"
            autoComplete="nric"
            sx={{ mb: 2 }}
            onChange={(event) => setNric(event.target.value)}
            autoFocus
          />
          <InputLabel id="vaccineCenterLabel">Vaccine Center</InputLabel>
          <Select
            labelId="vaccineCenterLabel"
            label="Vaccine Center"
            required
            fullWidth
            id="vaccineCenter"
            value={selectedCenterId}
            onChange={(event) => setSelectedCenterId(event.target.value)}
            sx={{ mb: 2 }}
          >
            {centers.map((v) => {
              return <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>;
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
            {slots.map((v) => (
              <MenuItem
                key={v.id} value={v.id}
              >
                {dayjs(v.date.toString()).format('DD-MMM-YYYY (ddd)')} {dayjs(v.start_time.toString()).format('HH:mm')}
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
    </React.Fragment >
  );
};
