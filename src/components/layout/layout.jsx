import { Outlet } from 'react-router-dom';

import Header from '../header/header';
import Footer from '../footer/footer';
import Cart from '../cart/cart';

import './layout.sass';

const Layout = () => {
  return (
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
  );
};

export default Layout;
