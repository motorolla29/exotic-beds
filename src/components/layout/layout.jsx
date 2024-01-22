import { Outlet } from 'react-router-dom';

import Header from '../header/header';
import Footer from '../footer/footer';

import './layout.sass';

const Layout = () => {
  return (
    <div className="layout">
      <Header />
      <div className="content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
