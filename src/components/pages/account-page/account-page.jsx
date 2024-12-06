import { useDispatch, useSelector } from 'react-redux';
import './account-page.sass';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { TbLogout2 } from 'react-icons/tb';
import { MdAddAPhoto } from 'react-icons/md';
import { ImBin } from 'react-icons/im';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  setCart,
  setConfirmationModal,
  setIsAuth,
  setLovelist,
  setNotificationModal,
  setUser,
} from '../../../store/action';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../api/userAPI';

const AccountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

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
        navigate('/');
        dispatch(setIsAuth(false));
        dispatch(setUser({}));
        localStorage.removeItem('token');
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
          </div>
          <MdAddAPhoto />
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
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            //onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="account-page_user-info_contact-details">
          <h2>Contact details:</h2>
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            //onChange={(e) => setEmail(e.target.value)}
          />
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
