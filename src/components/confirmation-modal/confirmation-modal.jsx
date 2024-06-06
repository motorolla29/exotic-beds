import { DialogActions, DialogContent, DialogTitle, Divider } from '@mui/joy';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

import './confirmation-modal.sass';

export const ConfirmationModal = ({
  modalOpen,
  setModalOpen,
  title,
  description,
  yesBtnText,
  noBtnText,
  action,
}) => {
  return (
    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
      <ModalDialog
        aria-labelledby="nested-modal-title"
        aria-describedby="nested-modal-description"
      >
        <DialogTitle>
          <WarningRoundedIcon />
          {title}
        </DialogTitle>
        <Divider />
        <DialogContent>{description}</DialogContent>
        <DialogActions>
          <Button
            variant="solid"
            color="danger"
            onClick={() => {
              action();
              setModalOpen(false);
            }}
          >
            {yesBtnText}
          </Button>
          <Button
            variant="plain"
            color="neutral"
            onClick={() => setModalOpen(false)}
          >
            {noBtnText}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};
