import { motion } from 'framer-motion';

import { IoCloseOutline } from 'react-icons/io5';

import './avatar-modal.sass';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { scrollController } from '../../utils';

const AvatarModal = ({ avatarSrc, onAvatarShadowClick }) => {
  const overlayLoading = useSelector((state) => state.overlayLoading);
  const [showContextMenu, setShowContextMenu] = useState(false);

  const handleShadowClick = (e) => {
    if (showContextMenu) {
      setShowContextMenu(false);
      return;
    }
    onAvatarShadowClick();
  };

  useEffect(() => {
    if (!overlayLoading) {
      scrollController.disabledScroll();
    }
    return () => scrollController.enabledScroll();
  }, [overlayLoading]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="avatar-modal-shadow"
      onClick={handleShadowClick}
    >
      <motion.div
        onContextMenu={() => setShowContextMenu(true)}
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.2 }}
        className="avatar-modal"
      >
        <img alt="avatar_photo" src={avatarSrc} />
      </motion.div>
      <IoCloseOutline />
    </motion.div>
  );
};
export default AvatarModal;
