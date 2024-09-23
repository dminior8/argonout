import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button, Container, Typography, Box, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './userProfile.css'; // Import stylów

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState({
    id: '',
    username: '',
    email: '',
    firstName: '',
    surname: '',
    role: '',
    points: 0,
    createdAt: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get('accessTokenFront');
        if (!token) {
          console.error("No token, can't get data.");
          return;
        }

        const response = await axios.get('http://localhost:8080/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserProfile(response.data);
        setEditedProfile(response.data); // Initialize edit form with current profile data
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const token = Cookies.get('accessTokenFront');
      await axios.put('http://localhost:8080/api/users/me', editedProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = Cookies.get('accessTokenFront');
      await axios.delete('http://localhost:8080/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Cookies.remove('accessTokenFront');
      navigate('/api/auth/login');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <Container className="user-profile-container">
      <Typography variant="h4" className="user-profile-header">User Profile</Typography>
      <Box className="user-profile-details">
        {isEditing ? (
          <div className="user-profile-edit-form">
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={editedProfile.username}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={editedProfile.email}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={editedProfile.firstName}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="Surname"
              name="surname"
              value={editedProfile.surname}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />
            <Box className="user-profile-buttons">
              <Button className="save-button" onClick={handleSave}>
                Save
              </Button>
              <Button className="cancel-button" onClick={handleEditToggle}>
                Cancel
              </Button>
            </Box>
          </div>
        ) : (
          <>
            <Typography variant="body1">Username: {userProfile.username}</Typography>
            <Typography variant="body1">Email: {userProfile.email}</Typography>
            <Typography variant="body1">First Name: {userProfile.firstName}</Typography>
            <Typography variant="body1">Surname: {userProfile.surname}</Typography>
            <Typography variant="body1">Role: {userProfile.role}</Typography>
            <Typography variant="body1">Points: {userProfile.points}</Typography>
            <Typography variant="body1">
              Created At: {new Date(userProfile.createdAt).toLocaleString()}
            </Typography>
            <Box className="user-profile-buttons">
              <Button className="save-button" onClick={handleEditToggle}>
                Edit Profile
              </Button>
              <Button className="delete-button" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default UserProfile;
