import { TbPasswordUser } from 'react-icons/tb';

const ForgotPasswordSuccess = ({ email, setForgotPasswordStage }) => {
  return (
    <div className="login-modals_success">
      <h2>Password Changed</h2>
      <TbPasswordUser />
      <p>
        You have successfully changed your password. Sign in using your email (
        {email}) and the password you just created.
      </p>
      <button
        onClick={() => setForgotPasswordStage(null)}
        className="login-modals_success_button"
      >
        Ok
      </button>
    </div>
  );
};

export default ForgotPasswordSuccess;
