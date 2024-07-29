import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@mui/joy/Snackbar';

import { setSnackbar } from '../../store/action';

import './main-snackbar.sass';

export const MainSnackbar = () => {
  const dispatch = useDispatch();
  const snackbar = useSelector((state) => state.snackbar);
  const open = snackbar.open;

  return (
    <Snackbar
      key={`${snackbar.id},${snackbar.text}`}
      open={open}
      onClose={(event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        dispatch(setSnackbar({ ...snackbar, open: false }));
      }}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      startDecorator={snackbar.decorator}
    >
      {snackbar.text}
    </Snackbar>
  );
};
