import { Outlet } from 'react-router-dom';

import Header from '../header/header';
import Footer from '../footer/footer';

import './layout.sass';
import Cart from '../cart/cart';

const Layout = () => {
  return (
    <div className="layout">
      <Header />
      <div className="content">
        <Outlet />
        <Cart />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
