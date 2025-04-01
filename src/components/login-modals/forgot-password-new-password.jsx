import { TextField } from '@mui/material';
import { useState } from 'react';
import useWindowSize from '../../hooks/use-window-size';

import ErrorIcon from '@mui/icons-material/Error';
import PulseLoader from 'react-spinners/PulseLoader';
import { updatePassword } from '../../api/userAPI';
import { setNotificationModal } from '../../store/action';
import { useDispatch } from 'react-redux';

const ForgotPasswordNewPassword = ({ email, code, setForgotPasswordStage }) => {
  const [ww] = useWindowSize();
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordValid, setPasswordValid] = useState(true);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(true);

  const [passwordError, setPasswordError] = useState('');

  const [submitClicked, setSubmitClicked] = useState(false);

  const [loading, setLoading] = useState(false);

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

  const onSubmit = async () => {
    setSubmitClicked(true);
    if (passwordValid && confirmPasswordValid) {
      try {
        setLoading(true);
        await updatePassword({
          email,
          inputCode: +code,
          newPassword: password,
        });
        setLoading(false);
        setForgotPasswordStage('success');
      } catch (e) {
        setLoading(false);
        dispatch(
          setNotificationModal({
            open: true,
            icon: <ErrorIcon />,
            title: 'Failed to reset password',
            description: e.response.data.message || e.message,
          })
        );
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
      </div>
      <button
        onClick={onSubmit}
        className="login-modals_new-password_submit"
        disabled={!password || !confirmPassword || loading}
      >
        {loading ? <PulseLoader size={20} color="#C4E2CF" /> : 'Submit'}
      </button>
    </div>
  );
};

export default ForgotPasswordNewPassword;
