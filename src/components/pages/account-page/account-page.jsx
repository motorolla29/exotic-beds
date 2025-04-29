import { NavLink, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import './account-page.sass';

const AccountPage = () => {
  return (
    <div className="account-page">
      <Helmet>
        <title>My Profile</title>
      </Helmet>
      {/* <Breadcrumbs /> */}
      <div className="account-page_tabs">
        <NavLink to="/account" end>
          Profile
        </NavLink>
        <NavLink to="/account/orders">My Orders</NavLink>
      </div>
      <Outlet />
    </div>
  );
};

export default AccountPage;
