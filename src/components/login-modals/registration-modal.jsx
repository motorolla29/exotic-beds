import { TextField } from '@mui/material';
import { useState } from 'react';
import CircleLoader from 'react-spinners/CircleLoader';
import { registration } from '../../api/userAPI';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginModalsOpen,
  setIsAuth,
  setNotificationModal,
  setUser,
} from '../../store/action';
import useWindowSize from '../../hooks/use-window-size';
import ErrorIcon from '@mui/icons-material/Error';

const RegistrationModal = ({ setRegistrated }) => {
  const dispatch = useDispatch();
  const [ww] = useWindowSize();
  const deviceId = useSelector((state) => state.deviceId);
  const [loading, setLoading] = useState(false);
  const [continueClicked, setContinueClicked] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameValid, setNameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(true);

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const onNameChange = (e) => {
    nameError && setNameError(false);
    setName(e.target.value);
    if (/^[а-яА-Яa-zA-Z_\s]{2,32}$/.test(e.target.value)) {
      setNameValid(true);
    } else {
      setNameValid(false);
    }
  };
  const onEmailChange = (e) => {
    emailError && setEmailError(false);
    setEmail(e.target.value);
    if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e.target.value)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };
  const onPasswordChange = (e) => {
    passwordError && setPasswordError(false);
    setPassword(e.target.value);
    if (/.{6,}$/.test(e.target.value)) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
    if (e.target.value === confirmPassword) {
      setConfirmPasswordValid(true);
    } else {
      setConfirmPasswordValid(false);
    }
  };
  const onConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value === password) {
      setConfirmPasswordValid(true);
    } else {
      setConfirmPasswordValid(false);
    }
  };

  const signUpHandler = async () => {
    setContinueClicked(true);
    if (nameValid && emailValid && passwordValid && confirmPasswordValid) {
      try {
        setLoading(true);
        const user = await registration(name, email, password, deviceId);
        setLoading(false);
        dispatch(setUser(user));
        dispatch(setIsAuth(true));
      } catch (e) {
        setLoading(false);
        if (e.response && e.response.data.errors) {
          e.response.data.errors.name &&
            setEmailError(e.response.data.errors.name);
          e.response.data.errors.email &&
            setEmailError(e.response.data.errors.email);
          e.response.data.errors.password &&
            setEmailError(e.response.data.errors.password);
        } else {
          console.log(e);
          dispatch(
            setNotificationModal({
              open: true,
              icon: <ErrorIcon />,
              title: 'Registration failed',
              description: 'Something went wrong, try again later',
            })
          );
        }
      }
    }
  };

  return (
    <div className="login-modals_registration-inner">
      <h2>Create an account</h2>
      <div className="login-modals_registration-inner_textfields">
        <TextField
          required
          onChange={onNameChange}
          size={ww > 480 ? 'normal' : 'small'}
          value={name}
          fullWidth
          label="Name"
          variant="outlined"
          color="success"
          error={continueClicked && (nameError || !nameValid)}
          helperText={
            continueClicked && (nameError || !nameValid)
              ? nameError || 'Minimum 2, maximum 32 alphabetic only characters'
              : ''
          }
        />
        <TextField
          required
          onChange={onEmailChange}
          size={ww > 480 ? 'normal' : 'small'}
          value={email}
          fullWidth
          label="Email"
          variant="outlined"
          error={continueClicked && (emailError || !emailValid)}
          helperText={
            continueClicked && (emailError || !emailValid)
              ? emailError || 'Invalid email address'
              : ''
          }
        />
        <TextField
          required
          onChange={onPasswordChange}
          size={ww > 480 ? 'normal' : 'small'}
          value={password}
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          error={continueClicked && (passwordError || !passwordValid)}
          helperText={
            continueClicked && (passwordError || !passwordValid)
              ? passwordError || 'Password must be at least 6 characters long'
              : ''
          }
        />
        <TextField
          required
          onChange={onConfirmPasswordChange}
          size={ww > 480 ? 'normal' : 'small'}
          value={confirmPassword}
          fullWidth
          label="Confirm password"
          variant="outlined"
          type="password"
          error={continueClicked && !confirmPasswordValid}
          helperText={
            continueClicked && !confirmPasswordValid
              ? 'Passwords do not match'
              : ''
          }
        />
      </div>
      <button
        onClick={signUpHandler}
        className="login-modals_registration-inner_registration-button"
        disabled={
          loading ||
          !name ||
          !email ||
          !password ||
          !confirmPassword ||
          nameError ||
          emailError ||
          passwordError
        }
      >
        {loading ? <CircleLoader size={20} color="#C4E2CF" /> : 'Continue'}
      </button>
      <p>Already have an account?</p>
      <p
        onClick={() => setRegistrated(true)}
        className="login-modals_registration-inner_to-sign-in-switch"
      >
        Sign in
      </p>
    </div>
  );
};

export default RegistrationModal;
