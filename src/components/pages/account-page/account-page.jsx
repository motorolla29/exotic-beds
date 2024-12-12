import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import { ClickAwayListener, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { TbLogout2 } from 'react-icons/tb';
import { HiOutlineCamera } from 'react-icons/hi';
import { TbCameraPlus } from 'react-icons/tb';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { ImBin } from 'react-icons/im';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  setCart,
  setConfirmationModal,
  setIsAuth,
  setLovelist,
  setNotificationModal,
  setSnackbar,
  setUser,
} from '../../../store/action';
import { useNavigate } from 'react-router-dom';
import { deleteAvatar, deleteUser, setAvatar } from '../../../api/userAPI';
import SyncLoader from 'react-spinners/SyncLoader';
import { isTouchSupported } from 'detect-mobile';

import './account-page.sass';
import { VERCEL_MAX_FILE_SIZE } from '../../../const';
import { resizeImage } from '../../../utils';

const AccountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [avatarHovered, setAvatarHovered] = useState(false);
  const [avatarOptionsOpen, setAvatarOptionsOpen] = useState(false);
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

  const onSignoutHandler = () => {
    dispatch(setIsAuth(false));
    dispatch(setUser({}));
    dispatch(setCart(JSON.parse(localStorage.getItem('cart')) || []));
    dispatch(setLovelist([]));
    localStorage.removeItem('token');
    dispatch(
      setSnackbar({
        open: true,
        text: 'You have been logged out of your account',
        decorator: <LogoutIcon />,
      })
    );
    navigate('/');
  };

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
        dispatch(setIsAuth(false));
        dispatch(setUser({}));
        localStorage.removeItem('token');
        navigate('/');
        setTimeout(() => {
          dispatch(
            setNotificationModal({
              open: true,
              icon: <CheckCircleIcon />,
              title: 'Successful Deletion',
              description: 'You have successfully deleted your account',
            })
          );
        });
      }, 500)
      .catch((error) => {
        console.log(error);
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
          })
        );
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          setNotificationModal({
            open: true,
            icon: <ErrorIcon />,
            title: 'Avatar deletion failed',
            description: err.response.data.message,
          })
        );
      })
      .finally(() => setLoading(false));
  };

  const onAvatarInputChange = async (e) => {
    setLoading(true);
    setAvatarOptionsOpen(false);

    const img = e.target.files[0];

    try {
      // Сжимаем изображение и автоматически исправляем ориентацию
      const resizedFile = await resizeImage(img);
      // Проверяем размер после сжатия
      console.log('Resized file:', resizedFile);
      console.log('File size:', resizedFile.size);
      if (resizedFile.size > VERCEL_MAX_FILE_SIZE) {
        dispatch(
          setNotificationModal({
            open: true,
            icon: <ErrorIcon />,
            title: 'File size too large',
            description: 'Please upload a file smaller than 4.5 MB.',
          })
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
            })
          );
        })
        .catch((err) => {
          console.log(err);
          dispatch(
            setNotificationModal({
              open: true,
              icon: <ErrorIcon />,
              title: 'Avatar loading failed',
              description: err.response.data.message,
            })
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
        })
      );
      setLoading(false);
    }
  };

  // Если пользователь не авторизован, ничего не отображаем
  if (!isAuth) return null;

  return (
    <div className="account-page">
      <Breadcrumbs />
      <div className="account-page_heading">
        <div className="account-page_heading_photo-container">
          <div className="account-page_heading_photo">
            <img
              style={{ opacity: loading ? 0.5 : 1 }}
              alt="user_photo"
              src={
                user.photo ||
                'https://res.cloudinary.com/ddprwf1qr/image/upload/v1734006782/default-avatar.jpg'
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
                className="account-page_heading_photo"
                onChange={onAvatarInputChange}
                onClick={onAvatarClick}
              />
            </label>

            {!isTouchSupported() && avatarHovered && !loading && (
              <div className="account-page_heading_photo_background">
                <HiOutlineCamera />
              </div>
            )}

            {loading && (
              <div className="account-page_heading_photo_loading-background">
                <SyncLoader speedMultiplier={0.9} />
              </div>
            )}
          </div>

          <AnimatePresence>
            {avatarOptionsOpen && (
              <ClickAwayListener
                onClickAway={() => setAvatarOptionsOpen(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.1 }}
                  className="account-page_heading_photo-container_options"
                >
                  <div className="account-page_heading_photo-container_options_option update">
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
                    className="account-page_heading_photo-container_options_option delete"
                  >
                    <RiDeleteBin5Line />
                    <span>Delete photo</span>
                  </div>
                </motion.div>
              </ClickAwayListener>
            )}
          </AnimatePresence>
        </div>
        <div className="account-page_heading_title">
          <h1>My Profile #{user.id}</h1>
          <div
            onClick={onSignoutHandler}
            className="account-page_heading_title_signout"
          >
            <TbLogout2 />
            <span>Sign out</span>
          </div>
        </div>
      </div>
      <div className="account-page_user-info">
        <div className="account-page_user-info_personal-data">
          <h2>Personal data:</h2>
          <TextField label="Name" variant="outlined" value={name} />
        </div>
        <div className="account-page_user-info_contact-details">
          <h2>Contact details:</h2>
          <TextField label="Email" variant="outlined" value={email} />
        </div>
      </div>
      <div onClick={onDeleteAccountClick} className="account-page_delete">
        <ImBin />
        <span>Delete my account</span>
      </div>
    </div>
  );
};

export default AccountPage;
