import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { loginModalsOpen } from '../../store/action';
import { scrollController } from '../../utils';
import RegistrationModal from './registration-modal';
import SignInModal from './sign-in-modal';
import { ReactComponent as SuccessIcon } from '../../images/success.svg';

import './login-modals.sass';

const LoginModals = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.isAuth);
  const overlayLoading = useSelector((state) => state.overlayLoader);
  const isOpen = useSelector((state) => state.loginModalsOpen);
  const isCartOpen = useSelector((state) => state.isCartOpen);
  const [registrated, setRegistrated] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setRegistrated(true);
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
              key="login-modals"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
              onMouseDown={(e) => e.stopPropagation()}
              className="login-modals"
            >
              {registrated ? (
                <SignInModal setRegistrated={setRegistrated} />
              ) : (
                <RegistrationModal setRegistrated={setRegistrated} />
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModals;
