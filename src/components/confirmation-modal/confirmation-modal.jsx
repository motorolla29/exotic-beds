import { DialogActions, DialogContent, DialogTitle, Divider } from '@mui/joy';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

import './confirmation-modal.sass';
import { Transition } from 'react-transition-group';

const ConfirmationModal = ({
  modalOpen,
  setModalOpen,
  title,
  description,
  yesBtnText,
  noBtnText,
  action,
}) => {
  return (
    <Transition in={modalOpen} timeout={400}>
      {(state) => (
        <Modal
          keepMounted
          open={!['exited', 'exiting'].includes(state)}
          onClose={() => setModalOpen(false)}
          slotProps={{
            backdrop: {
              sx: {
                opacity: 0,
                backdropFilter: 'none',
                transition: `opacity 400ms, backdrop-filter 400ms`,
                ...{
                  entering: { opacity: 1, backdropFilter: 'blur(8px)' },
                  entered: { opacity: 1, backdropFilter: 'blur(8px)' },
                }[state],
              },
            },
          }}
          sx={{
            visibility: state === 'exited' ? 'hidden' : 'visible',
          }}
        >
          <ModalDialog
            aria-labelledby="nested-modal-title"
            aria-describedby="nested-modal-description"
            sx={{
              opacity: 0,
              top: '10%',
              transition: `top 400ms, opacity 300ms`,
              ...{
                entering: { opacity: 1, top: '55%' },
                entered: { opacity: 1, top: '50%' },
              }[state],
            }}
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
      )}
    </Transition>
  );
};

export default ConfirmationModal;
