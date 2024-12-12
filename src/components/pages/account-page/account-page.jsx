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

import './account-page.sass';

const AccountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    if (user.photo) {
      e.preventDefault();
      setAvatarOptionsOpen(true);
      return;
    }
  };

  const onAvatarDeleteClick = (e) => {
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
      .catch((err) => console.log(err));
  };

  const onAvatarInputChange = async (e) => {
    const img = e.target.files[0];
    const formData = new FormData();
    formData.append('photo', img);
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
      .catch((err) => console.log(err));
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
              alt="user_photo"
              src={`${process.env.REACT_APP_API_URL}/user-avatars/${
                user.photo || 'default-avatar.jpg'
              }`}
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

            {avatarHovered && (
              <div className="account-page_heading_photo_background">
                <HiOutlineCamera />
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
