/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from 'react-redux';
import { InputAdornment, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import { CiMail } from 'react-icons/ci';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ErrorIcon from '@mui/icons-material/Error';

import { setNotificationModal, setSnackbar, setUser } from '../../store/action';
import { resendActivationMail, updateContactData } from '../../api/userAPI';
import { nullAndUndefinedToEmptyString } from '../../utils';

import './profile-page-contact-details.sass';

const ProfilePageContactDetails = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const [isChanges, setIsChanges] = useState(false);
  const [saveChangesClicked, setSaveChangesClicked] = useState(false);
  const [dataSending, setDataSending] = useState(false);

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneInputHelperText, setPhoneInputHelperText] = useState('');

  const [emailValid, setEmailValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);

  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const [cooldownTime, setCooldownTime] = useState(0);
  const [loadingSendMail, setLoadingSendMail] = useState(false);

  useEffect(() => {
    setEmail(user.email ? user.email : email);
    setPhone(
      user.phone
        ? nullAndUndefinedToEmptyString(user.phone).replace(/\D/g, '')
        : phone
    );

    if (!user.phone)
      setPhoneInputHelperText(
        'Enter your phone number in international format'
      );
  }, [user.email, user.phone]);

  useEffect(() => {
    if (
      nullAndUndefinedToEmptyString(user.email) !== email ||
      nullAndUndefinedToEmptyString(user.phone).replace(/\D/g, '') !== phone
    ) {
      setIsChanges(true);
    } else {
      setIsChanges(false);
    }
  }, [email, phone, saveChangesClicked]);

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

  const handlePhoneChange = (event) => {
    phoneError && setPhoneError(false);

    //Удаляем все символы, кроме цифр и плюса
    const sanitizedValue = event.target.value.replace(/[^\d]/g, '');

    // Если поле очищается, сохраняем пустое значение
    if (sanitizedValue === '') {
      setPhone('');
      setPhoneValid(false);
      return;
    }

    if (/^[0-9]{10,15}$/.test(sanitizedValue)) {
      setPhoneValid(true);
    } else {
      setPhoneValid(false);
    }

    setPhone(sanitizedValue);
  };

  const handleEmailChange = (event) => {
    emailError && setEmailError(false);
    setEmail(event.target.value);
    if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(event.target.value)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  const onSaveButtonClick = () => {
    setSaveChangesClicked(true);
    if (emailValid && phoneValid) {
      setDataSending(true);
      updateContactData({ email, phone: `+${phone}` })
        .then((user) => {
          setSaveChangesClicked(false);
          dispatch(setUser(user));
          dispatch(
            setSnackbar({
              open: true,
              text: 'Contact data updated successfully',
              decorator: <AccountBoxIcon />,
            })
          );
        })
        .catch((e) => {
          if (e.response && e.response.data.errors) {
            e.response.data.errors.email &&
              setEmailError(e.response.data.errors.email);
            e.response.data.errors.phone &&
              setPhoneError(e.response.data.errors.phone);
          } else {
            dispatch(
              setNotificationModal({
                open: true,
                icon: <ErrorIcon />,
                title: e.response.data.message || e.message,
                description: 'Error updating contact data, try again later',
              })
            );
          }
        })
        .finally(() => setDataSending(false));
    }
  };

  const emailErrorCondition =
    (user.email === email && !user.isActivated) ||
    (saveChangesClicked && (emailError || !emailValid));

  return (
    <div className="profile-page_user-info_contact-details">
      <h2>Contact details:</h2>
      <div className="profile-page_user-info_contact-details_email">
        <TextField
          className="profile-page_user-info_contact-details_email_field"
          label="Email"
          variant="outlined"
          value={email}
          onChange={handleEmailChange}
          error={emailErrorCondition}
          helperText={
            saveChangesClicked && (emailError || !emailValid)
              ? emailError || 'Invalid email address'
              : ''
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ), // Иконка mail перед полем ввода
          }}
        />
        {user.email === email && !emailError && emailValid && (
          <div className="profile-page_user-info_contact-details_email_confirm">
            {!user.isActivated && (
              <>
                <span className="profile-page_user-info_contact-details_email_confirm_info">
                  Requires confirmation
                </span>
                <button
                  disabled={loadingSendMail || cooldownTime}
                  onClick={handleSendConfirmation}
                  className={`profile-page_user-info_contact-details_email_confirm_button ${
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
        )}
      </div>
      <div className="profile-page_user-info_contact-details_phone">
        <TextField
          className="profile-page_user-info_contact-details_phone_field"
          label="Phone Number"
          variant="outlined"
          value={`+${phone}`}
          onChange={handlePhoneChange}
          error={saveChangesClicked && (phoneError || !phoneValid)}
          helperText={
            saveChangesClicked && (phoneError || !phoneValid)
              ? phoneError ||
                'Please enter a valid phone number (e.g., +1234567890)'
              : phoneInputHelperText
          }
          InputProps={{
            inputMode: 'tel', // Подсказка для мобильных устройств
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon />
              </InputAdornment>
            ), // Иконка телефона перед полем ввода
          }}
        />
      </div>
      <button
        disabled={!isChanges || dataSending}
        onClick={onSaveButtonClick}
        className="profile-page_user-info_contact-details_save-button"
      >
        Save Changes
      </button>
    </div>
  );
};

export default ProfilePageContactDetails;
