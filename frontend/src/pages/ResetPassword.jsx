import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setError, setMessage } from '../features/auth/authSlice';
import { resetUserPassword } from '../features/auth/authThunk';

import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, message, isLoading } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (error || message) setDialogOpen(true);
  }, [error, message]);

  const handleDialogClose = () => {
    setDialogOpen(false);
    dispatch(setError(null));
    dispatch(setMessage(null));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      dispatch(setError('Passwords do not match'));
      return;
    }

    dispatch(setError(null));
    if (isLoading) return;
    dispatch(setMessage(null));
    if (!token) {
      dispatch(setError('Invalid or missing token'));
      return;
    }

    const resultAction = await dispatch(resetUserPassword({ token, password }));

    if (resetUserPassword.fulfilled.match(resultAction)) {
      dispatch(setMessage('Password reset successfully! Please login with your new password.'));
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  return (
    <Box
      component={Paper}
      elevation={6}
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        p: 4,
        borderRadius: 3,
        textAlign: 'center',
      }}
    >
      <LockResetIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
      <Typography variant="h5" gutterBottom>
        Reset Password
      </Typography>

      <form onSubmit={handleSubmit} autoComplete="off">
        <TextField
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          margin="normal"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          inputProps={{ minLength: 6 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((show) => !show)}
                  edge="end"
                  size="large"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirm New Password"
          type={showConfirmPassword ? 'text' : 'password'}
          variant="outlined"
          margin="normal"
          fullWidth
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          inputProps={{ minLength: 6 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={() => setShowConfirmPassword((show) => !show)}
                  edge="end"
                  size="large"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, py: 1.5 }}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <LockResetIcon />}
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {error ? 'Error' : 'Success'}
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {error && <Alert severity="error">{error}</Alert>}
          {message && <Alert severity="success">{message}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}