import { DialogActions, DialogContent, DialogTitle, Divider } from '@mui/joy';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import { Transition } from 'react-transition-group';
import { useDispatch, useSelector } from 'react-redux';
import { setConfirmationModal } from '../../store/action';

import './confirmation-modal.sass';

const ConfirmationModal = () => {
  const dispatch = useDispatch();
  const confirmationModal = useSelector((state) => state.confirmationModal);

  return (
    <Transition in={confirmationModal.open} timeout={400}>
      {(state) => (
        <Modal
          keepMounted
          open={!['exited', 'exiting'].includes(state)}
          onClose={() => {
            dispatch(
              setConfirmationModal({ ...confirmationModal, open: false })
            );
          }}
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
              {confirmationModal.icon}
              {confirmationModal.title}
            </DialogTitle>
            <Divider />
            <DialogContent>{confirmationModal.description}</DialogContent>
            <DialogActions>
              <Button
                variant="solid"
                color="danger"
                onClick={() => {
                  confirmationModal.action();
                  dispatch(
                    setConfirmationModal({ ...confirmationModal, open: false })
                  );
                }}
              >
                {confirmationModal.yesBtnText}
              </Button>
              <Button
                variant="plain"
                color="neutral"
                onClick={() => {
                  dispatch(
                    setConfirmationModal({ ...confirmationModal, open: false })
                  );
                }}
              >
                {confirmationModal.noBtnText}
              </Button>
            </DialogActions>
          </ModalDialog>
        </Modal>
      )}
    </Transition>
  );
};

export default ConfirmationModal;
