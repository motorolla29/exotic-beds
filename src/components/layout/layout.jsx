import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { OverlayScrollbars } from 'overlayscrollbars';

import Header from '../header/header';
import Footer from '../footer/footer';
import Cart from '../cart/cart';
import LogoSpinnerOverlay from '../logo-spinner-overlay/logo-spinner-overlay';
import { MainSnackbar } from '../main-snackbar/main-snackbar';
import Chat from '../chat/chat';
import LoginModals from '../login-modals/login-modals';
import NotificationModal from '../notification-modal/notification-modal';
import ConfirmationModal from '../confirmation-modal/confirmation-modal';

import 'overlayscrollbars/overlayscrollbars.css';
import './layout.sass';

const Layout = () => {
  const cartOpen = useSelector((state) => state.isCartOpen);
  const loginModalsOpen = useSelector((state) => state.loginModalsOpen);

  const mainScrollConfig = {
    scrollbars: {
      theme: 'os-theme-main',
      visibility: `${cartOpen || loginModalsOpen ? 'hidden' : 'auto'}`,
    },
  };

  OverlayScrollbars(document.body, mainScrollConfig);

  return (
    <div className="layout">
      <Header />
      <div className="main-container">
        <div className="main">
          <Outlet />
          <Cart />
          <LogoSpinnerOverlay />
          <MainSnackbar />
          <LoginModals />
          <NotificationModal />
          <ConfirmationModal />
          <Chat />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
