import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '../components/Buttons/Button';

export default function ConfirmDialog({
    open = false,
    onClose,
    onConfirm,
    title = 'Confirmar',
    message = '',
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    confirmVariant = 'primary',
    cancelVariant = 'neutral',
    isLoading = false,
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #00ffcc',
                    boxShadow: '0 0 20px rgba(0, 255, 204, 0.3)',
                },
            }}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
        >
            <DialogTitle
                id="confirm-dialog-title"
                style={{
                    color: confirmVariant === 'danger' ? '#ff0033' : '#00ffcc',
                    fontWeight: 'bold'
                }}
            >
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText
                    id="confirm-dialog-description"
                    style={{ color: '#fff' }}
                >
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} label={cancelLabel} variant={cancelVariant} />
                <Button
                    onClick={onConfirm}
                    label={isLoading ? 'Aguarde...' : confirmLabel}
                    variant={confirmVariant}
                    disabled={isLoading}
                />
            </DialogActions>
        </Dialog>
    );
}