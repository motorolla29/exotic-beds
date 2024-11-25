import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { loginModalsOpen } from '../../store/action';
import { scrollController } from '../../utils';
import RegistrationModal from './registration-modal';
import SignInModal from './sign-in-modal';

import './login-modals.sass';

const LoginModals = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.loginModalsOpen);
  const [registrated, setRegistrated] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setRegistrated(true);
      scrollController.disabledScroll();
    } else {
      scrollController.enabledScroll();
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onMouseDown={() => dispatch(loginModalsOpen(false))}
          className="login-modals-shadow"
        >
          <motion.div
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModals;
