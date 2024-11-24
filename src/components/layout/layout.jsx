import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { OverlayScrollbars } from 'overlayscrollbars';

import Header from '../header/header';
import Footer from '../footer/footer';
import Cart from '../cart/cart';
import LogoSpinner from '../logo-spinner/logo-spinner';
import { MainSnackbar } from '../main-snackbar/main-snackbar';
import Chat from '../chat/chat';
import SignInModal from '../sign-in-modal/sign-in-modal';

import 'overlayscrollbars/overlayscrollbars.css';
import './layout.sass';

const Layout = () => {
  const cartOpen = useSelector((state) => state.isCartOpen);
  const signInModalOpen = useSelector((state) => state.isSignInModalOpen);

  const mainScrollConfig = {
    scrollbars: {
      theme: 'os-theme-main',
      visibility: `${cartOpen || signInModalOpen ? 'hidden' : 'auto'}`,
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
          <LogoSpinner />
          <MainSnackbar />
          <SignInModal />
          <Chat />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
