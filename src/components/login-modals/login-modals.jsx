/* eslint-disable react-hooks/exhaustive-deps */
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { loginModalsOpen } from '../../store/action';
import { scrollController } from '../../utils';
import RegistrationModal from './registration-modal';
import SignInModal from './sign-in-modal';
import { ReactComponent as SuccessIcon } from '../../images/success.svg';
import { LuMailCheck } from 'react-icons/lu';

import ForgotPasswordNewPassword from './forgot-password-new-password';
import ForgotPasswordCode from './forgot-password-code';
import ForgotPasswordSuccess from './forgot-password-success';
import { sendPasswordResetCode } from '../../api/userAPI';

import './login-modals.sass';

const LoginModals = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.isAuth);
  const overlayLoading = useSelector((state) => state.overlayLoader);
  const isOpen = useSelector((state) => state.loginModalsOpen);
  const isCartOpen = useSelector((state) => state.isCartOpen);
  const [registrated, setRegistrated] = useState(true);
  const [forgotPasswordStage, setForgotPasswordStage] = useState(null); // "null" | "code" | "password" | "success"
  const [resetEmail, setResetEmail] = useState(null);
  const [resetPasswordCode, setResetPasswordCode] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setRegistrated(true);
      setForgotPasswordStage(null);
      if (!isCartOpen && !overlayLoading) scrollController.disabledScroll();
    } else {
      if (!isCartOpen && !overlayLoading) scrollController.enabledScroll();
    }
  }, [isOpen]);

  const onPopStateHandler = () => {
    dispatch(loginModalsOpen(false));
  };
  useEffect(() => {
    window.addEventListener('popstate', onPopStateHandler);
    return () => {
      window.removeEventListener('popstate', onPopStateHandler);
    };
  }, []);

  const onForgotPassword = (email) => {
    try {
      sendPasswordResetCode({ email });
      setResetEmail(email);
      setForgotPasswordStage('code');
    } catch (err) {
      console.error('Error sending code', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="login-modals-shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, delay: 2 }}
          transition={{ duration: 0.5 }}
          onMouseDown={() => dispatch(loginModalsOpen(false))}
          className="login-modals-shadow"
        >
          {isAuth ? (
            <>
              {registrated ? (
                <motion.div
                  key="sign-in-success"
                  initial={{ opacity: 0, y: -100 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      type: 'spring',
                      bounce: 0.3,
                      delay: 0.25,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: -100,
                    transition: {
                      duration: 0.5,
                      type: 'spring',
                      bounce: 0.3,
                    },
                  }}
                  className="success-div"
                >
                  <SuccessIcon />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -100 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      type: 'spring',
                      bounce: 0.3,
                      delay: 0.25,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: -100,
                    transition: {
                      duration: 0.5,
                      type: 'spring',
                      bounce: 0.3,
                    },
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="email-confirm-notification-div"
                >
                  <LuMailCheck />
                  <p className="email-confirm-notification-div_title">
                    Confirmation email sent!
                  </p>
                  <div className="email-confirm-notification-div_description">
                    We have sent you an email with a link to confirm your email.
                    Please check your email and follow the instructions.
                  </div>
                  <button
                    onClick={() => dispatch(loginModalsOpen(false))}
                    className="email-confirm-notification-div_button"
                  >
                    Ok
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              key="login-modals"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
              onMouseDown={(e) => e.stopPropagation()}
              className="login-modals"
            >
              {forgotPasswordStage === 'code' && (
                <ForgotPasswordCode
                  setForgotPasswordStage={setForgotPasswordStage}
                  email={resetEmail}
                  setResetCode={setResetPasswordCode}
                />
              )}
              {forgotPasswordStage === 'password' && (
                <ForgotPasswordNewPassword
                  email={resetEmail}
                  code={resetPasswordCode}
                  setForgotPasswordStage={setForgotPasswordStage}
                />
              )}
              {forgotPasswordStage === 'success' && (
                <ForgotPasswordSuccess
                  email={resetEmail}
                  setForgotPasswordStage={setForgotPasswordStage}
                />
              )}
              {forgotPasswordStage === null &&
                (registrated ? (
                  <SignInModal
                    setRegistrated={setRegistrated}
                    onForgotPassword={onForgotPassword}
                  />
                ) : (
                  <RegistrationModal setRegistrated={setRegistrated} />
                ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModals;
