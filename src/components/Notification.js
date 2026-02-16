import { Snackbar, Alert } from '@mui/material';

export default function Notification({ 
  open, 
  message, 
  severity = 'success', 
  onClose, 
  duration = 5000,
  anchorOrigin = { vertical: 'top', horizontal: 'center' }
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
