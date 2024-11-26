import { TextField } from '@mui/material';
import { useState } from 'react';
import CircleLoader from 'react-spinners/CircleLoader';

const SignInModal = ({ setRegistrated }) => {
  const [signInClicked, setSignInClicked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onEmailChange = (e) => {
    setEmail(e.target.value);
    if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e.target.value)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };
  const onPasswordChange = (e) => {
    setPassword(e.target.value);
    if (/.{6,}$/.test(e.target.value)) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  };

  const signInHandler = () => {
    setSignInClicked(true);
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
