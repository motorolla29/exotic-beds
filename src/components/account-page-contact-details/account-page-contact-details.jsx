import { useDispatch, useSelector } from 'react-redux';
import { InputAdornment, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import { CiMail } from 'react-icons/ci';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

import { setNotificationModal, setSnackbar } from '../../store/action';
import { resendActivationMail } from '../../api/userAPI';

import './account-page-contact-details.sass';

const AccountPageContactDetails = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneFieldError, setPhoneFieldError] = useState(false);

  const [cooldownTime, setCooldownTime] = useState(0);
  const [loadingSendMail, setLoadingSendMail] = useState(false);

  useEffect(() => {
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
  const handlePhoneChange = (event) => {
    const value = event.target.value;

    // Удаляем все символы, кроме цифр и плюса
    const sanitizedValue = value.replace(/[^\d+]/g, '');

    // Проверяем формат номера телефона (опциональный "+", затем цифры длиной 10-15)
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    setPhone(sanitizedValue);
    setPhoneFieldError(
      !phoneRegex.test(sanitizedValue) && sanitizedValue.length > 0
    ); // Ошибка только если что-то введено
  };

  return (
    <div className="account-page_user-info_contact-details">
      <h2>Contact details:</h2>
      <div className="account-page_user-info_contact-details_email">
        <TextField
          error={!user.isActivated}
          label="Email"
          variant="outlined"
          value={email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ), // Иконка mail перед полем ввода
          }}
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
      <div className="account-page_user-info_contact-details_phone">
        <TextField
          label="Phone Number"
          variant="outlined"
          value={phone}
          onChange={handlePhoneChange}
          error={phoneFieldError}
          helperText={
            phoneFieldError
              ? 'Please enter a valid phone number (e.g., +1234567890)'
              : 'Enter your phone number in international format'
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
      <button className="account-page_user-info_contact-details_save-button">
        Save Changes
      </button>
    </div>
  );
};

export default AccountPageContactDetails;
