import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import { ImBin } from 'react-icons/im';
import { CiMail } from 'react-icons/ci';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

import {
  setConfirmationModal,
  setIsAuth,
  setNotificationModal,
  setSnackbar,
  setUser,
} from '../../../store/action';
import { useNavigate } from 'react-router-dom';
import { deleteUser, resendActivationMail } from '../../../api/userAPI';
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
  const [cooldownTime, setCooldownTime] = useState(0);
  const [loadingSendMail, setLoadingSendMail] = useState(false);

  useEffect(() => {
    if (user.name) {
      setName(user.name);
    }
    if (user.email) {
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    // Восстановление таймера из localStorage
    const storedExpiration = localStorage.getItem('confirmationCooldown');

    if (storedExpiration) {
      const expirationTime = Number(storedExpiration); // Время истечения в миллисекундах
      const remainingTime = Math.ceil((expirationTime - Date.now()) / 1000);

      // Если время не истекло, восстанавливаем таймер
      if (remainingTime > 0) {
        setCooldownTime(remainingTime);
      } else {
        // Если время истекло, сбрасываем таймер
        localStorage.removeItem('confirmationCooldown');
      }
    }
  }, []);

  useEffect(() => {
    // Таймер для обратного отсчета
    let timer = null;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prevTime) => {
          if (prevTime - 1 <= 0) {
            clearInterval(timer); // Останавливаем интервал, когда таймер достигает 0
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer); // Очистка интервала при размонтировании
      }
    };
  }, [cooldownTime]);

  const handleSendConfirmation = () => {
    if (cooldownTime > 0) return;

    setLoadingSendMail(true);

    resendActivationMail(email)
      .then((res) => {
        dispatch(
          setSnackbar({
            open: true,
            decorator: <MarkEmailReadIcon />,
            text: 'The letter was sent successfully',
          })
        );

        const cooldownDuration = 60; // Длительность таймера в секундах
        const expirationTime = Date.now() + cooldownDuration * 1000;

        // Сохраняем время истечения в localStorage
        localStorage.setItem('confirmationCooldown', expirationTime.toString());

        setCooldownTime(cooldownDuration); // Устанавливаем отсечку
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          setNotificationModal({
            open: true,
            icon: <ReportGmailerrorredIcon />,
            title: 'Error sending confirmation email',
            description: err.response.data.message || err.message,
          })
        );
      })
      .finally(() => setLoadingSendMail(false));
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

                  <button
                    disabled={loadingSendMail || cooldownTime}
                    onClick={handleSendConfirmation}
                    className={`account-page_user-info_contact-details_email_confirm_button ${
                      cooldownTime ? 'cooldown' : ''
                    }`}
                  >
                    {cooldownTime ? (
                      `Send again in ${cooldownTime} sec`
                    ) : (
                      <>
                        <CiMail />
                        Send a confirmation email
                      </>
                    )}
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
