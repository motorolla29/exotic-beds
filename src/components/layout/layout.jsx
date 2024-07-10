import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { OverlayScrollbars } from 'overlayscrollbars';

import Header from '../header/header';
import Footer from '../footer/footer';
import Cart from '../cart/cart';
import LogoSpinner from '../logo-spinner/logo-spinner';
import { MainSnackbar } from '../main-snackbar/main-snackbar';
import Chat from '../chat/chat';

import 'overlayscrollbars/overlayscrollbars.css';
import './layout.sass';

const Layout = () => {
  const cartOpen = useSelector((state) => state.isCartOpen);
  const location = useLocation();

  const mainScrollConfig = {
    scrollbars: {
      theme: 'os-theme-main',
      visibility: `${cartOpen ? 'hidden' : 'auto'}`,
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
          {location.pathname !== '/store-finder' ? <Chat /> : null}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
