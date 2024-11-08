import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import api from '../api/api';
import { TextField, Button, Typography, Container, Box } from '@mui/material';

const Login = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login/', { username, password });
      dispatch(setUser({
        user: response.data.user,
        token: response.data.access,
      }));
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding={2}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth
            type="submit"
            sx={{ marginTop: 2 }}
          >
            Login
          </Button>
        </form>
        {error && <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>{error}</Typography>}
      </Box>
    </Container>
  );
};

export default Login;
