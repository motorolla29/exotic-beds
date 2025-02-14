import { NavLink, Outlet } from 'react-router-dom';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';

import './account-page.sass';

const AccountPage = () => {
  return (
    <div className="account-page">
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
