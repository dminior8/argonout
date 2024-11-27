import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  MenuItem,
  Button,
  Paper,
} from "@mui/material";

import "./editUserForm.css"

const EditUserForm = ({ onSubmit, editedData, roles, statuses }) => {
  const [formData, setFormData] = useState({
    username: editedData?.username || "",
    email: editedData?.email || "",
    firstName: editedData?.firstName || "",
    surname: editedData?.surname || "",
    role: editedData?.role || "",
    points: editedData?.points || 0,
    status: editedData?.status || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "points" ? parseInt(value, 10) || 0 : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        bgcolor: "#131F24",
        color: "#d1d1d1",
        p: 4,
        borderRadius: 1,
        maxWidth: 700,
        mx: "auto",
        mt: "0",
      }}
    >
      <Typography variant="h5" textAlign="center" fontWeight="bold" marginBottom="20pt" gutterBottom>
        Edycja użytkownika
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        {/* Dane użytkownika */}
        <Grid container spacing={3}>
          {/* Username */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nazwa użytkownika"
              name="username"
              value={formData.username}
              onChange={handleChange}
              InputLabelProps={{ style: { color: "#bbb" } }}
              InputProps={{ style: { color: "#fff" } }}
              className="edit-form-input"
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              InputLabelProps={{ style: { color: "#bbb" } }}
              InputProps={{ style: { color: "#fff" } }}
              className="edit-form-input"
            />
          </Grid>

          {/* First Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Imię"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              InputLabelProps={{ style: { color: "#bbb" } }}
              InputProps={{ style: { color: "#fff" } }}
              className="edit-form-input"
            />
          </Grid>

          {/* Surname */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nazwisko"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              InputLabelProps={{ style: { color: "#bbb" } }}
              InputProps={{ style: { color: "#fff" } }}
              className="edit-form-input"
            />
          </Grid>

          {/* Role */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Rola użytkownika"
              name="role"
              value={formData.role}
              onChange={handleChange}
              InputLabelProps={{ style: { color: "#bbb" } }}
              InputProps={{ style: { color: "#fff" } }}
              className="edit-form-input"
              sx={{filter:"brightness(1.3)"}}
            >
              {Object.entries(roles).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                    {value}
                </MenuItem>
               ))}
            </TextField>
          </Grid>

          {/* Points */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Punkty"
              name="points"
              type="number"
              value={formData.points}
              onChange={handleChange}
              InputLabelProps={{ style: { color: "#bbb" } }}
              InputProps={{ style: { color: "#fff" } }}
              className="edit-form-input"
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              InputLabelProps={{ style: { color: "#bbb" } }}
              InputProps={{ style: { color: "#fff" } }}
              className="edit-form-input"
              sx={{filter:"brightness(1.3)"}}
            >
              {Object.entries(statuses).map(([key,value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Box textAlign="right" mt={1}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#2F7A7E",
              color: "#fff",
              px: 4,
              py: 1,
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#1E585B",
              },
            }}
          >
            Zapisz zmiany
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default EditUserForm;
