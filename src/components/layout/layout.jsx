import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

import Header from '../header/header';
import Footer from '../footer/footer';
import Cart from '../cart/cart';

import 'overlayscrollbars/overlayscrollbars.css';
import './layout.sass';

const Layout = () => {
  const cartOpen = useSelector((state) => state.isCartOpen);

  const mainScrollConfig = {
    scrollbars: {
      theme: 'os-theme-main',
      visibility: `${cartOpen ? 'hidden' : 'auto'}`,
    },
  };

  return (
    <OverlayScrollbarsComponent options={mainScrollConfig} defer>
      <div className="layout">
        <Header />
        <div className="main-container">
          <div className="main">
            <Outlet />
            <Cart />
          </div>
        </div>
        <Footer />
      </div>
    </OverlayScrollbarsComponent>
  );
};

export default Layout;
