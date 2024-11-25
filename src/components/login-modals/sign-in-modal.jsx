import { TextField } from '@mui/material';
import { useState } from 'react';
import CircleLoader from 'react-spinners/CircleLoader';

const SignInModal = ({ setRegistrated }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const signInHandler = () => {};

  return (
    <div className="login-modals_sign-in-inner">
      <h2>Sign in</h2>
      <div className="login-modals_sign-in-inner_textfields">
        <TextField
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          fullWidth
          id="outlined-basic"
          label="Email"
          variant="outlined"
          error
          helperText="Wrong email"
        />
        <TextField
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          fullWidth
          id="outlined-basic"
          label="Password"
          variant="outlined"
        />
      </div>
      <button
        onClick={signInHandler}
        className="login-modals_sign-in-inner_sign-in-button"
        disabled={loading}
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
