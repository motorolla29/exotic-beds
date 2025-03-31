import { TextField } from '@mui/material';
import { useState } from 'react';
import useWindowSize from '../../hooks/use-window-size';

import PulseLoader from 'react-spinners/PulseLoader';

const ForgotPasswordNewPassword = ({ email }) => {
  const [ww] = useWindowSize();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordValid, setPasswordValid] = useState(true);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(true);

  const [passwordError, setPasswordError] = useState('');

  const [submitClicked, setSubmitClicked] = useState(false);

  const [loading, setLoading] = useState(true);

  const onPasswordChange = (e) => {
    setSubmitClicked(false);
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
    setSubmitClicked(false);
    setConfirmPassword(e.target.value);
    if (e.target.value === password) {
      setConfirmPasswordValid(true);
    } else {
      setConfirmPasswordValid(false);
    }
  };

  const onSubmit = () => {
    setSubmitClicked(true);
    if (passwordValid && confirmPasswordValid) {
      try {
        setLoading(true);
        // await resetPassword(email, password);
        //setLoading(false);
        //setTimeout(() => dispatch(loginModalsOpen(false)), 1500);
      } catch (e) {
        setLoading(false);
        // if (e.response && e.response.data.errors) {
        //   e.response.data.errors.email &&
        //     setEmailError(e.response.data.errors.email);
        //   e.response.data.errors.password &&
        //     setPasswordError(e.response.data.errors.password);
        // } else {
        //   dispatch(
        //     setNotificationModal({
        //       open: true,
        //       icon: <ErrorIcon />,
        //       title: 'Sign in failed',
        //       description: 'Something went wrong, try again later',
        //     })
        //   );
        // }
        console.log(e);
      }
    }
  };

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      if (password && confirmPassword && !loading) onSubmit();
    }
  };

  return (
    <div className="login-modals_new-password">
      <h2>New Password</h2>
      <p>Create a new password (minimum 6 characters)</p>
      <div className="login-modals_new-password_textfields">
        <TextField
          required
          onChange={onPasswordChange}
          size={ww > 480 ? 'normal' : 'small'}
          value={password}
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          error={submitClicked && (!!passwordError || !passwordValid)}
          helperText={
            submitClicked && (passwordError || !passwordValid)
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
          error={submitClicked && !confirmPasswordValid}
          helperText={
            submitClicked && !confirmPasswordValid
              ? 'Passwords do not match'
              : ''
          }
        />
        <button
          onClick={onSubmit}
          className="login-modals_new-password_submit"
          disabled={!password || !confirmPassword || loading}
        >
          {loading ? <PulseLoader size={20} color="#C4E2CF" /> : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordNewPassword;
