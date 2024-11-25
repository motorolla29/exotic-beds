import { TextField } from '@mui/material';
import { useState } from 'react';
import CircleLoader from 'react-spinners/CircleLoader';

const RegistrationModal = ({ setRegistrated }) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const [nameValid, setNameValid] = useState();
  const [emailValid, setEmailValid] = useState();
  const [passwordValid, setPasswordValid] = useState();

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const signUpHandler = () => {};

  return (
    <div className="login-modals_registration-inner">
      <h2>Create an account</h2>
      <div className="login-modals_registration-inner_textfields">
        <TextField
          onChange={(e) => setName(e.target.value)}
          value={name}
          fullWidth
          id="outlined-basic"
          label="Name"
          variant="outlined"
          color="success"
          error
          helperText="Wrong name"
        />
        <TextField
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          fullWidth
          id="outlined-basic"
          label="Email"
          variant="outlined"
          error={error.email}
          helperText={error.email}
        />
        <TextField
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          fullWidth
          id="outlined-basic"
          label="Password"
          variant="outlined"
        />
        <TextField
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          fullWidth
          id="outlined-basic"
          label="Confirm password"
          variant="outlined"
        />
      </div>
      <button
        onClick={signUpHandler}
        className="login-modals_registration-inner_registration-button"
        disabled={loading}
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
