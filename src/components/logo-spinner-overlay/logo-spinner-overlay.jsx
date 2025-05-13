import { useSelector } from 'react-redux';
import { useEffect } from 'react';

import LogoSpinner from '../logo-spinner/logo-spinner';
import { scrollController } from '../../utils';

import './logo-spinner-overlay.sass';

const LogoSpinnerOverlay = () => {
  const loading = useSelector((state) => state.overlayLoader);

  useEffect(() => {
    if (loading) {
      scrollController.disabledScroll();
    } else {
      scrollController.enabledScroll();
    }
  }, [loading]);

  return (
    loading && (
      <div className="logo-spinner-overlay_shadow">
        <div className="logo-spinner-overlay">
          <LogoSpinner />
        </div>
      </div>
    )
  );
};

export default LogoSpinnerOverlay;
