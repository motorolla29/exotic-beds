import { TextField } from '@mui/material';
import { useState } from 'react';
import CircleLoader from 'react-spinners/CircleLoader';
import { login } from '../../api/userAPI';
import { useDispatch } from 'react-redux';
import {
  loginModalsOpen,
  setCart,
  setIsAuth,
  setLovelist,
  setNotificationModal,
  setUser,
} from '../../store/action';
import { getBasket } from '../../api/basketAPI';
import { getLovelist } from '../../api/lovelistAPI';
import ErrorIcon from '@mui/icons-material/Error';

const SignInModal = ({ setSuccessSignIn, setRegistrated }) => {
  const dispatch = useDispatch();
  const [signInClicked, setSignInClicked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const user = await login(email, password);
      setLoading(false);
      dispatch(setUser(user));
      dispatch(setIsAuth(true));
      setTimeout(() => dispatch(loginModalsOpen(false)), 1500);
    } catch (e) {
      setLoading(false);
      if (e.response) {
        e.response?.data.email && setEmailError(e.response.data.email);
        e.response?.data.password && setPasswordError(e.response.data.password);
      } else {
        dispatch(
          setNotificationModal({
            open: true,
            icon: <ErrorIcon />,
            title: e.message,
            description: 'Something went wrong, try again later',
          })
        );
      }
      console.log(e);
    } finally {
    }
  };

  return (
    <div className="login-modals_sign-in-inner">
      <h2>Sign in</h2>
      <div className="login-modals_sign-in-inner_textfields">
        <TextField
          onChange={onEmailChange}
          value={email}
          fullWidth
          label="Email"
          variant="outlined"
          error={signInClicked && emailError}
          helperText={signInClicked && emailError ? emailError : false}
        />
        <TextField
          onChange={onPasswordChange}
          value={password}
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          error={signInClicked && passwordError}
          helperText={signInClicked && passwordError ? passwordError : false}
        />
      </div>
      <button
        onClick={signInHandler}
        className="login-modals_sign-in-inner_sign-in-button"
        disabled={loading || emailError || passwordError || !password || !email}
      >
        {loading ? <CircleLoader size={20} color="#C4E2CF" /> : 'Sign in'}
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
