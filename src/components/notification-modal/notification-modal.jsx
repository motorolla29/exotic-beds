import { DialogActions, DialogContent, DialogTitle, Divider } from '@mui/joy';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Transition } from 'react-transition-group';

import './notification-modal.sass';
import { useDispatch, useSelector } from 'react-redux';
import { setNotificationModal } from '../../store/action';

const NotificationModal = () => {
  const dispatch = useDispatch();
  const notificationModal = useSelector((state) => state.notificationModal);
  return (
    <Transition in={notificationModal.open} timeout={400}>
      {(state) => (
        <Modal
          keepMounted
          open={!['exited', 'exiting'].includes(state)}
          onClose={() =>
            dispatch(
              setNotificationModal({ ...notificationModal, open: false })
            )
          }
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
              {notificationModal.icon}
              {notificationModal.title}
            </DialogTitle>
            <Divider />
            <DialogContent>{notificationModal.description}</DialogContent>
            <DialogActions>
              <Button
                className="notification-action-button"
                variant="solid"
                color="danger"
                onClick={() => {
                  dispatch(
                    setNotificationModal({ ...notificationModal, open: false })
                  );
                }}
              >
                Ok
              </Button>
            </DialogActions>
          </ModalDialog>
        </Modal>
      )}
    </Transition>
  );
};

export default NotificationModal;
