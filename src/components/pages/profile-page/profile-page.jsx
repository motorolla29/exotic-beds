import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { ImBin } from 'react-icons/im';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import {
  setConfirmationModal,
  setIsAuth,
  setNotificationModal,
  setUser,
} from '../../../store/action';
import { deleteUser } from '../../../api/userAPI';
import AvatarModal from '../../avatar-modal/avatar-modal';
import ProfilePageHeader from '../../profile-page-header/profile-page-header';
import ProfilePagePersonalData from '../../profile-page-personal-data/profile-page-personal-data';
import ProfilePageContactDetails from '../../profile-page-contact-details/profile-page-contact-details';

import './profile-page.sass';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  const user = useSelector((state) => state.user);
  const isAuth = useSelector((state) => state.isAuth);

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
    <div className="profile-page">
      <ProfilePageHeader setAvatarModalOpen={setAvatarModalOpen} />
      <div className="profile-page_user-info">
        <ProfilePagePersonalData />
        <ProfilePageContactDetails />
      </div>
      <div className="profile-page_delete">
        <div
          onClick={onDeleteAccountClick}
          className="profile-page_delete_button"
        >
          <ImBin />
          <span>Delete my account</span>
        </div>
      </div>
      <AnimatePresence>
        {avatarModalOpen && (
          <AvatarModal
            avatarSrc={
              user.photo
                ? `https://res.cloudinary.com/ddprwf1qr/image/upload/user-avatars/${user.photo}`
                : 'https://res.cloudinary.com/ddprwf1qr/image/upload/v1734006782/default-avatar.jpg'
            }
            onAvatarShadowClick={() => setAvatarModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
