/* eslint-disable react-hooks/exhaustive-deps */
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import CircleLoader from 'react-spinners/CircleLoader';
import { login } from '../../api/userAPI';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginModalsOpen,
  setCart,
  setIsAuth,
  setLovelist,
  setNotificationModal,
  setUser,
} from '../../store/action';
import ErrorIcon from '@mui/icons-material/Error';
// import { BsEye } from 'react-icons/bs';
// import { BsEyeSlash } from 'react-icons/bs';
// import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
// import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
// import { IoEyeOutline } from 'react-icons/io5';
// import { IoEyeOffOutline } from 'react-icons/io5';
import { TbEye } from 'react-icons/tb';
import { TbEyeOff } from 'react-icons/tb';
import useWindowSize from '../../hooks/use-window-size';
import { getLovelist } from '../../api/lovelistAPI';
import { getBasket } from '../../api/basketAPI';

const SignInModal = ({ setRegistrated, onForgotPassword }) => {
  const dispatch = useDispatch();
  const [ww] = useWindowSize();
  const deviceId = useSelector((state) => state.deviceId);
  const [loading, setLoading] = useState(false);
  const [signInClicked, setSignInClicked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const onEmailChange = (e) => {
    setEmailError(false);
    setEmail(e.target.value);
  };
  const onPasswordChange = (e) => {
    setPasswordError(false);
    setPassword(e.target.value);
  };

  const signInHandler = async () => {
    setSignInClicked(true);
    try {
      setLoading(true);
      const user = await login(email, password, deviceId);
      setLoading(false);
      dispatch(setUser(user));
      dispatch(setIsAuth(true));
      const [basket, lovelist] = await Promise.all([
        getBasket(),
        getLovelist(),
      ]);
      dispatch(setCart(basket));
      dispatch(setLovelist(lovelist));
      setTimeout(() => dispatch(loginModalsOpen(false)), 1500);
    } catch (e) {
      setLoading(false);
      if (e.response && e.response.data.errors) {
        e.response.data.errors.email &&
          setEmailError(e.response.data.errors.email);
        e.response.data.errors.password &&
          setPasswordError(e.response.data.errors.password);
      } else {
        dispatch(
          setNotificationModal({
            open: true,
            icon: <ErrorIcon />,
            title: 'Sign in failed',
            description: 'Something went wrong, try again later',
          })
        );
      }
      console.log(e);
    }
  };

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      if (email && password && !loading && !emailError && !passwordError)
        signInHandler();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEnterPress);
    return () => {
      window.removeEventListener('keydown', handleEnterPress);
    };
  }, [email, password, loading, emailError, passwordError]);

  return (
    <div className="login-modals_sign-in-inner">
      <h2>Sign in</h2>
      <div className="login-modals_sign-in-inner_textfields">
        <TextField
          onChange={onEmailChange}
          size={ww > 480 ? 'normal' : 'small'}
          value={email}
          fullWidth
          label="Email"
          variant="outlined"
          error={!!signInClicked && !!emailError}
          helperText={signInClicked && emailError ? emailError : false}
        />
        <TextField
          className={`${
            signInClicked && !emailError && passwordError && 'forgot-password'
          }`}
          onChange={onPasswordChange}
          size={ww > 480 ? 'normal' : 'small'}
          value={password}
          fullWidth
          label="Password"
          variant="outlined"
          type={passwordVisible ? 'text' : 'password'}
          error={!!signInClicked && !!passwordError}
          helperText={signInClicked && passwordError ? passwordError : false}
          slotProps={{
            input: {
              endAdornment: (
                <div className="password-field-eye-container">
                  <div
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className={`password-field-eye ${
                      passwordVisible ? 'visible' : 'hidden'
                    }`}
                  >
                    <TbEyeOff
                      className={`${
                        passwordVisible ? 'visible-icon' : 'hidden-icon'
                      }`}
                    />
                    <TbEye
                      className={`${
                        passwordVisible ? 'hidden-icon' : 'visible-icon'
                      }`}
                    />
                  </div>
                </div>
              ),
            },
          }}
        />
        {/* <div className="password-field-eye-container">
            <div
              onClick={() => setPasswordVisible(!passwordVisible)}
              className={`password-field-eye ${
                passwordVisible ? 'visible' : 'hidden'
              }`}
            >
              <TbEyeOff
                className={`${
                  passwordVisible ? 'visible-icon' : 'hidden-icon'
                }`}
              />
              <TbEye
                className={`${
                  passwordVisible ? 'hidden-icon' : 'visible-icon'
                }`}
              />
            </div>
        </div> */}
        {signInClicked && !emailError && passwordError && (
          <div className="login-modals_sign-in-inner_textfields_forgot-password-button">
            <span onClick={() => onForgotPassword(email)}>
              Forgot password?
            </span>
          </div>
        )}
      </div>
      <button
        onClick={signInHandler}
        className="login-modals_sign-in-inner_sign-in-button"
        disabled={loading || emailError || passwordError || !password || !email}
      >
        {loading ? <CircleLoader color="#C4E2CF" /> : 'Sign in'}
      </button>
      <p>or</p>
      <p
        onClick={() => setRegistrated(false)}
        className="login-modals_sign-in-inner_to-register-switch"
      >
        Create a new account
      </p>
    </div>
  );
};

export default SignInModal;
