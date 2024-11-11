import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button, Container, Box, TextField, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
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
    <Container 
    maxWidth="md" // Ustawiamy maksymalną szerokość kontenera
    sx={{ 
    
    minHeight: "100vh", 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: '0 2rem' // Opcjonalnie: dodaj padding, aby karta nie przylegała do krawędzi kontenera
  }}
>
  <Sidebar />
  
  <Card 
    sx={{
      maxWidth: '50vw', 
      minWidth: "50vh",
      maxHeight: '90vh',
      backgroundColor: '#202F36', 
      color: '#D1D1D1', 
      borderRadius: '12px', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
      padding: '2rem', 
      flexShrink: 0 // Zapobiega ściskaniu karty, co pomaga ustawić szerokość maksymalną
    }}
  >
    <CardContent>
          <Box sx={{ textAlign: 'center', color: '#3ac2c9', marginBottom: '1rem', fontSize: '2vh', fontWeight: 'bold' }}>
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
                <Button onClick={handleSave} variant="contained" color="primary" sx={{ minWidth: '4rem' }}>
                  Save
                </Button>
                <Button onClick={handleEditToggle} variant="outlined" color="secondary" sx={{ minWidth: '4rem' }}>
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
                  secondaryTypographyProps={{ sx: { color: '#def7f4', fontSize: '2vh' } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Email" 
                  secondary={userProfile.email} 
                  primaryTypographyProps={{ sx: { fontWeight: 'bold'} }}
                  secondaryTypographyProps={{ sx: { color: '#def7f4', fontSize: '2vh'} }}
                  
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="First Name" 
                  secondary={userProfile.firstName} 
                  primaryTypographyProps={{ sx: { fontWeight: 'bold'} }}
                  secondaryTypographyProps={{ sx: { color: '#def7f4', fontSize: '2vh' } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Surname" 
                  secondary={userProfile.surname} 
                  primaryTypographyProps={{ sx: { fontWeight: 'bold' } }}
                  secondaryTypographyProps={{ sx: { color: '#def7f4', fontSize: '2vh' } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Role" 
                  secondary={userProfile.role} 
                  primaryTypographyProps={{ sx: { fontWeight: 'bold'} }}
                  secondaryTypographyProps={{ sx: { color: '#def7f4', fontSize: '2vh' } }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Created At" 
                  secondary={new Date(userProfile.createdAt).toLocaleString()} 
                  primaryTypographyProps={{ sx: { fontWeight: 'bold'} }}
                  secondaryTypographyProps={{ sx: { color: '#def7f4', fontSize: '2vh' } }}
                />
              </ListItem>


              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                <Button onClick={handleEditToggle} variant="contained" color="primary" sx={{ minWidth: '6rem' }}>
                  Edit Profile
                </Button>
                <Button onClick={handleDeleteAccount} variant="outlined" color="error" sx={{ marginLeft: "5vw", minWidth: '6rem' }}>
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