import { useState } from 'react';
import CodeInput from '../code-input/code-input';

const ForgotPasswordCode = ({ email, setForgotPasswordStage }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const verifyCode = async (code) => {
    setLoading(true);
    try {
      //await api.verifyResetCode({ email, code }); // Имитация API-запроса
      console.log(code);
      if (+code === 5555) {
        setForgotPasswordStage('password');
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Wrong code', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-modals_verify-email ${error ? 'error' : ''}`}>
      <h2>Verify Email</h2>
      <p>Enter the 4 digit code. We sent it to your email {email}</p>
      <CodeInput
        onComplete={verifyCode}
        error={error}
        onChange={() => setError(false)}
      />
    </div>
  );
};

export default ForgotPasswordCode;
