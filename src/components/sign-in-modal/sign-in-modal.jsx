import { motion } from 'framer-motion';
import './sign-in-modal.sass';
import { signInModalOpen } from '../../store/action';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { scrollController } from '../../utils';

const SignInModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.isSignInModalOpen);
  useEffect(() => {
    if (isOpen) {
      scrollController.disabledScroll();
    } else {
      scrollController.enabledScroll();
    }
  }, [isOpen]);
  return (
    isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => dispatch(signInModalOpen(false))}
        className="sign-in-modal-shadow"
      >
        <div className="sign-in-modal">modal</div>
      </motion.div>
    )
  );
};

export default SignInModal;
