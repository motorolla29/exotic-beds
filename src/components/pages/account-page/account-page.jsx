import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import { ImBin } from 'react-icons/im';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import {
  setConfirmationModal,
  setIsAuth,
  setNotificationModal,
  setUser,
} from '../../../store/action';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../api/userAPI';
import AvatarModal from '../../avatar-modal/avatar-modal';
import AccountPageHeader from '../../account-page-header/account-page-header';

import './account-page.sass';

const AccountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  const user = useSelector((state) => state.user);
  const isAuth = useSelector((state) => state.isAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user.name) {
      setName(user.name);
    }
    if (user.email) {
      setEmail(user.email);
    }
  }, [user]);

  const onDeleteAccountClick = () => {
    dispatch(
      setConfirmationModal({
        open: true,
        icon: <DeleteForeverIcon />,
        title: 'Delete Account?',
        description:
          'Are you sure you want to delete your account? It will not be possible to restore it...',
        yesBtnText: 'Confirm',
        noBtnText: 'Cancel',
        action: onDeleteAccountConfirm,
      })
    );
  };

  const onDeleteAccountConfirm = () => {
    deleteUser()
      .then((res) => {
        setTimeout(() => {
          dispatch(setIsAuth(false));
          dispatch(setUser({}));
          localStorage.removeItem('token');
          navigate('/');
        }, 250);
        setTimeout(() => {
          dispatch(
            setNotificationModal({
              open: true,
              icon: <CheckCircleIcon />,
              title: 'Successful Deletion',
              description: 'You have successfully deleted your account',
            })
          );
        }, 500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Если пользователь не авторизован, ничего не отображаем
  if (!isAuth) return null;

  return (
    <div className="account-page">
      <Breadcrumbs />
      <AccountPageHeader setAvatarModalOpen={setAvatarModalOpen} />
      <div className="account-page_user-info">
        <div className="account-page_user-info_personal-data">
          <h2>Personal data:</h2>
          <TextField label="Name" variant="outlined" value={name} />
        </div>
        <div className="account-page_user-info_contact-details">
          <h2>Contact details:</h2>
          <div className="account-page_user-info_contact-details_email">
            <TextField
              error={!user.isActivated}
              label="Email"
              variant="outlined"
              value={email}
            />
            <div className="account-page_user-info_contact-details_email_confirm">
              {!user.isActivated && (
                <>
                  <span className="account-page_user-info_contact-details_email_confirm_info">
                    Requires confirmation
                  </span>
                  <button className="account-page_user-info_contact-details_email_confirm_button">
                    Send a confirmation email
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="account-page_delete">
        <div
          onClick={onDeleteAccountClick}
          className="account-page_delete_button"
        >
          <ImBin />
          <span>Delete my account</span>
        </div>
      </div>
      <AnimatePresence>
        {avatarModalOpen && (
          <AvatarModal
            avatarSrc={
              user.photo ||
              'https://res.cloudinary.com/ddprwf1qr/image/upload/v1734006782/default-avatar.jpg'
            }
            onAvatarShadowClick={() => setAvatarModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccountPage;
