import { TextField } from '@mui/material';
import { useState } from 'react';
import CircleLoader from 'react-spinners/CircleLoader';
import { registration } from '../../api/userAPI';
import { useDispatch } from 'react-redux';
import {
  loginModalsOpen,
  setCart,
  setIsAuth,
  setLovelist,
  setUser,
} from '../../store/action';
import { getBasket } from '../../api/basketAPI';
import { getLovelist } from '../../api/lovelistAPI';

const RegistrationModal = ({ setRegistrated }) => {
  const dispatch = useDispatch();
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
    if (/([а-яА-Яa-zA-Z_\s]+){2,}$/.test(e.target.value)) {
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

  const [loading, setLoading] = useState(false);

  const signUpHandler = async () => {
    setContinueClicked(true);
    if ((nameValid, emailValid, passwordValid, confirmPasswordValid)) {
      try {
        setLoading(true);
        const user = await registration(name, email, password);
        setLoading(false);
        dispatch(setUser(user));
        dispatch(setIsAuth(true));
        const basket = await getBasket();
        const lovelist = await getLovelist();
        dispatch(setCart(basket));
        dispatch(setLovelist(lovelist));
      } catch (e) {
        setLoading(false);
        e.response.data.name && setEmailError(e.response.data.name);
        e.response.data.email && setEmailError(e.response.data.email);
        e.response.data.password && setEmailError(e.response.data.password);
      } finally {
        setTimeout(() => dispatch(loginModalsOpen(false)), 1500);
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
          value={name}
          fullWidth
          label="Name"
          variant="outlined"
          color="success"
          error={continueClicked && (nameError || !nameValid)}
          helperText={
            continueClicked && (nameError || !nameValid)
              ? nameError || 'Minimum 2 alphabetic only characters'
              : false
          }
        />
        <TextField
          required
          onChange={onEmailChange}
          value={email}
          fullWidth
          label="Email"
          variant="outlined"
          error={continueClicked && (emailError || !emailValid)}
          helperText={
            continueClicked && (emailError || !emailValid)
              ? emailError || 'Invalid email address'
              : false
          }
        />
        <TextField
          required
          onChange={onPasswordChange}
          value={password}
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          error={continueClicked && (passwordError || !passwordValid)}
          helperText={
            continueClicked && (passwordError || !passwordValid)
              ? passwordError || 'Password must be at least 6 characters long'
              : false
          }
        />
        <TextField
          required
          onChange={onConfirmPasswordChange}
          value={confirmPassword}
          fullWidth
          label="Confirm password"
          variant="outlined"
          type="password"
          error={continueClicked && !confirmPasswordValid}
          helperText={
            continueClicked && !confirmPasswordValid
              ? 'Passwords do not match'
              : false
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
