import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button, Container, Box, TextField, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';

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
        setEditedProfile(response.data);
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
      window.location.reload();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };
  

  return (
    <Container sx={{ paddingTop: '3.5rem', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Sidebar />
      <Card sx={{width: '100%', maxWidth: '450px', backgroundColor: '#202F36', color: '#D1D1D1', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', padding: '2rem', margin: '2rem 0' }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', color: '#3ac2c9', marginBottom: '1.5rem', fontSize: '24px', fontWeight: 'bold' }}>
            User Profile
          </Box>
          {isEditing ? (
            <Box>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={editedProfile.username}
                onChange={handleChange}
                sx={{ marginBottom: 2 }}
                InputLabelProps={{
                  style: { color: '#D1D1D1', fontWeight: 'bold', letterSpacing: '2px' }, 
                }}
                InputProps={{
                  style: { color: '#def7f4' }, 
                }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={editedProfile.email}
                onChange={handleChange}
                sx={{ marginBottom: 2 }}
                InputLabelProps={{
                  style: { color: '#D1D1D1', fontWeight: 'bold', letterSpacing: '2px' }, 
                }}
                InputProps={{
                  style: { color: '#def7f4' }, 
                }}
              />
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={editedProfile.firstName}
                onChange={handleChange}
                sx={{ marginBottom: 2 }}
                InputLabelProps={{
                  style: { color: '#D1D1D1', fontWeight: 'bold', letterSpacing: '2px' }, 
                }}
                InputProps={{
                  style: { color: '#def7f4' }, 
                }}
              />
              <TextField
                fullWidth
                label="Surname"
                name="surname"
                value={editedProfile.surname}
                onChange={handleChange}
                sx={{ marginBottom: 2 }}
                InputLabelProps={{
                  style: { color: '#D1D1D1', fontWeight: 'bold', letterSpacing: '2px' }, 
                }}
                InputProps={{
                  style: { color: '#def7f4' },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                <Button onClick={handleSave} variant="contained" color="primary" sx={{ minWidth: '8rem' }}>
                  Save
                </Button>
                <Button onClick={handleEditToggle} variant="outlined" color="secondary" sx={{ minWidth: '8rem' }}>
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <List>
              <ListItem>
                <ListItemText 
                  primary="Username" 
                  secondary={userProfile.username} 
                  primaryTypographyProps={{ sx: { fontWeight: 'bold'} }}
                  secondaryTypographyProps={{ sx: { color: '#def7f4', fontSize: '16px' } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Email" 
                  secondary={userProfile.email} 
                  primaryTypographyProps={{ sx: { fontWeight: 'bold'} }}
                  secondaryTypographyProps={{ sx: { color: '#def7f4', fontSize: '16px'} }}
                  
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="First Name" 
                  secondary={userProfile.firstName} 
                  primaryTypographyProps={{ sx: { fontWeight: 'bold'} }}
                  secondaryTypographyProps={{ sx: { color: '#def7f4', fontSize: '16px' } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Surname" 
                  secondary={userProfile.surname} 
                  primaryTypographyProps={{ sx: { fontWeight: 'bold' } }}
                  secondaryTypographyProps={{ sx: { color: '#def7f4', fontSize: '16px' } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Role" 
                  secondary={userProfile.role} 
                  primaryTypographyProps={{ sx: { fontWeight: 'bold'} }}
                  secondaryTypographyProps={{ sx: { color: '#def7f4', fontSize: '16px' } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Points" 
                  secondary={userProfile.points} 
                  primaryTypographyProps={{ sx: { fontWeight: 'bold'} }}
                  secondaryTypographyProps={{ sx: { color: '#def7f4', fontSize: '16px' } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Created At" 
                  secondary={new Date(userProfile.createdAt).toLocaleString()} 
                  primaryTypographyProps={{ sx: { fontWeight: 'bold'} }}
                  secondaryTypographyProps={{ sx: { color: '#def7f4', fontSize: '16px' } }}
                />
              </ListItem>


              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                <Button onClick={handleEditToggle} variant="contained" color="primary" sx={{ minWidth: '8rem' }}>
                  Edit Profile
                </Button>
                <Button onClick={handleDeleteAccount} variant="outlined" color="error" sx={{ minWidth: '8rem' }}>
                  Delete Account
                </Button>
              </Box>
            </List>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserProfile;