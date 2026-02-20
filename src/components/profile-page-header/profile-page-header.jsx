import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { ClickAwayListener } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TbLogout2 } from 'react-icons/tb';
import { HiOutlineCamera } from 'react-icons/hi';
import { TbCameraPlus } from 'react-icons/tb';
import { RiDeleteBin5Line } from 'react-icons/ri';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorIcon from '@mui/icons-material/Error';
import LogoutIcon from '@mui/icons-material/Logout';
import { TbPhoto } from 'react-icons/tb';
import { PiCheckCircleBold } from 'react-icons/pi';
import SyncLoader from 'react-spinners/SyncLoader';

import {
  setCart,
  setIsAuth,
  setLovelist,
  setNotificationModal,
  setSnackbar,
  setUser,
} from '../../store/action';
import { deleteAvatar, logout, setAvatar } from '../../api/userAPI';
import { isTouchSupported } from 'detect-mobile';
import { VERCEL_MAX_FILE_SIZE } from '../../const';
import { resizeImage } from '../../utils';

import './profile-page-header.sass';

const ProfilePageHeader = ({ setAvatarModalOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [avatarHovered, setAvatarHovered] = useState(false);
  const [avatarOptionsOpen, setAvatarOptionsOpen] = useState(false);
  const onSignoutHandler = () => {
    logout()
      .then(() => {
        dispatch(setIsAuth(false));
        dispatch(setUser({}));
        dispatch(setCart(JSON.parse(localStorage.getItem('cart')) || []));
        dispatch(setLovelist([]));
        dispatch(
          setSnackbar({
            open: true,
            text: 'You have been logged out of your account',
            decorator: <LogoutIcon />,
          }),
        );
        navigate('/');
      })
      .catch((error) => {
        dispatch(
          setNotificationModal({
            open: true,
            icon: <ErrorIcon />,
            title: error.message,
            description: 'Failed to log out. Please try again.',
          }),
        );
        console.error('Logout error:', error);
      });
  };

  const onAvatarClick = (e) => {
    if (loading) {
      e.preventDefault();
      return;
    }
    if (user.photo && !loading) {
      e.preventDefault();
      setAvatarOptionsOpen(true);
      return;
    }
  };

  const onAvatarDeleteClick = (e) => {
    setLoading(true);
    setAvatarOptionsOpen(false);
    deleteAvatar()
      .then((user) => {
        dispatch(setUser(user));
        setAvatarOptionsOpen(false);
        dispatch(
          setSnackbar({
            open: true,
            text: 'You successfully deleted your avatar',
            decorator: <DeleteIcon />,
          }),
        );
      })
      .catch((err) => {
        dispatch(
          setNotificationModal({
            open: true,
            icon: <ErrorIcon />,
            title: 'Avatar deletion failed',
            description: err.response.data.message || err.message,
          }),
        );
      })
      .finally(() => setLoading(false));
  };

  const onAvatarInputChange = async (e) => {
    setAvatarOptionsOpen(false);

    const img = e.target.files?.[0];

    if (!img) {
      console.warn('No file selected');
      return;
    }

    setLoading(true);

    try {
      // Сжимаем изображение и автоматически исправляем ориентацию
      const resizedFile = await resizeImage(img);
      // Проверяем размер после сжатия
      if (resizedFile.size > VERCEL_MAX_FILE_SIZE) {
        dispatch(
          setNotificationModal({
            open: true,
            icon: <ErrorIcon />,
            title: 'File size too large',
            description: 'Please upload a file smaller than 4.5 MB.',
          }),
        );
        setLoading(false);
        return;
      }

      // Создаем FormData с сжатыми данными
      const formData = new FormData();
      formData.append('photo', resizedFile);

      // Проверка перед отправкой
      if (resizedFile.size === 0) {
        console.error('Error: The file is empty!');
        return;
      }

      // Отправляем сжатое изображение на сервер
      setAvatar(formData)
        .then((user) => {
          dispatch(setUser(user));
          setAvatarOptionsOpen(false);
          dispatch(
            setSnackbar({
              open: true,
              text: 'Avatar successfully uploaded',
              decorator: <AccountCircleIcon />,
            }),
          );
        })
        .catch((err) => {
          dispatch(
            setNotificationModal({
              open: true,
              icon: <ErrorIcon />,
              title: 'Avatar loading failed',
              description: err.response.data.message || err.message,
            }),
          );
        })
        .finally(() => setLoading(false));
    } catch (error) {
      console.error('Error processing image:', error);
      dispatch(
        setNotificationModal({
          open: true,
          icon: <ErrorIcon />,
          title: 'Avatar loading failed',
          description: 'Error processing image before upload.',
        }),
      );
      setLoading(false);
    }
  };

  return (
    <div className="profile-page_heading">
      <div className="profile-page_heading_photo-container">
        <div className="profile-page_heading_photo">
          <img
            style={{ opacity: loading ? 0.5 : 1 }}
            alt="user_photo"
            src={
              user.photo
                ? `https://exotic-beds.s3.cloud.ru/user-avatars/sm__${user.photo}`
                : 'https://exotic-beds.s3.cloud.ru/user-avatars/sm__default-avatar.jpg'
            }
          />
          <label
            onMouseEnter={() => {
              setAvatarHovered(true);
            }}
            onMouseLeave={() => {
              setAvatarHovered(false);
            }}
            htmlFor="avatar_load"
          >
            <input
              id="avatar_load"
              type="file"
              className="profile-page_heading_photo"
              onChange={onAvatarInputChange}
              onClick={onAvatarClick}
            />
          </label>

          {!isTouchSupported() && avatarHovered && !loading && (
            <div className="profile-page_heading_photo_background">
              <HiOutlineCamera />
            </div>
          )}

          {loading && (
            <div className="profile-page_heading_photo_loading-background">
              <SyncLoader speedMultiplier={0.9} />
            </div>
          )}
        </div>
        <AnimatePresence>
          {avatarOptionsOpen && (
            <ClickAwayListener onClickAway={() => setAvatarOptionsOpen(false)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.1 }}
                className="profile-page_heading_photo-container_options"
              >
                <div
                  onClick={() => {
                    setAvatarModalOpen(true);
                    setAvatarOptionsOpen(false);
                  }}
                  className="profile-page_heading_photo-container_options_option show"
                >
                  <TbPhoto />
                  <span>Show photo</span>
                </div>
                <div className="profile-page_heading_photo-container_options_option update">
                  <TbCameraPlus />
                  <span>Update photo</span>
                  <label htmlFor="avatar_change_option">
                    <input
                      id="avatar_change_option"
                      type="file"
                      onChange={onAvatarInputChange}
                    />
                  </label>
                </div>
                <div
                  onClick={onAvatarDeleteClick}
                  className="profile-page_heading_photo-container_options_option delete"
                >
                  <RiDeleteBin5Line />
                  <span>Delete photo</span>
                </div>
              </motion.div>
            </ClickAwayListener>
          )}
        </AnimatePresence>
      </div>
      <div className="profile-page_heading_title">
        <div className="profile-page_heading_title_profile-id">
          <h1>My Profile #{user.id}</h1>
          {user.isActivated && (
            <div className="profile-page_heading_title_profile-id_check-icon">
              <PiCheckCircleBold />
            </div>
          )}
        </div>
        <div
          onClick={onSignoutHandler}
          className="profile-page_heading_title_signout"
        >
          <TbLogout2 />
          <span>Sign out</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageHeader;
