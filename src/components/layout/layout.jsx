import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { OverlayScrollbars } from 'overlayscrollbars';

import Header from '../header/header';
import Footer from '../footer/footer';
import Cart from '../cart/cart';

import 'overlayscrollbars/overlayscrollbars.css';
import './layout.sass';
import LogoSpinner from '../logo-spinner/logo-spinner';
import { cartOpen } from '../../store/action';

const Layout = () => {
  const cartOpen = useSelector((state) => state.isCartOpen);

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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
