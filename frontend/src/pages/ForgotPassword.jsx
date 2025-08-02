import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setError, setMessage } from '../features/auth/authSlice';
import { forgotUserPassword } from '../features/auth/authThunk';

import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  Paper,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockResetIcon from '@mui/icons-material/LockReset';
import CloseIcon from '@mui/icons-material/Close';

export default function ForgotPassword() {
  const [email, setEmail] = React.useState('');
  const [openDialog, setOpenDialog] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, message, isLoading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setError(null));
    if (isLoading) return;
    dispatch(setMessage(null));
    if (!email) {
      dispatch(setError('Email is required'));
      return;
    }
    dispatch(forgotUserPassword(email));
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    if (!error) navigate('/');
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f6fa"
    >
      <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Box display="flex" alignItems="center" mb={2}>
          <LockResetIcon color="primary" sx={{ fontSize: 36, mr: 1 }} />
          <Typography variant="h5" fontWeight={600}>
            Forgot Password
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            label="Email"
            type="email"
            value={email}
            fullWidth
            required
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2, mb: 1 }}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <LockResetIcon />}
          >
            {isLoading ? 'Sending Email...' : 'Send Reset Link'}
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Remember your password?{' '}
          <Link href="/login" underline="hover">
            Login
          </Link>
        </Typography>
      </Paper>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          {error ? 'Error' : 'Email Sent'}
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
            size="large">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            {error
              ? error
              : 'If an account with that email exists, a password reset link has been sent.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            {error ? 'Try Again' : 'OK'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}