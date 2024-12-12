import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { cartOpen, loginModalsOpen } from '../../store/action';
import HeaderSearchPanel from '../header-search-panel/header-serach-panel';
import useWindowSize from '../../hooks/use-window-size';

import { ReactComponent as BasketIcon } from '../../images/ui-icons/basket-icon.svg';
import { ReactComponent as HeartIcon } from '../../images/ui-icons/heart-icon.svg';
import { ReactComponent as PinIcon } from '../../images/ui-icons/pin-icon.svg';
import { ReactComponent as UserIcon } from '../../images/ui-icons/user-icon.svg';

import './header.sass';

const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.isAuth);
  const user = useSelector((state) => state.user);

  const lovelistLength = useSelector((state) => state.lovelistProducts.length);
  const basketLength = useSelector((state) => {
    return state.cartProducts.reduce(
      (acc, currentValue) => acc + currentValue.quantity,
      0
    );
  });

  const [ww] = useWindowSize();

  return (
    <div className="header-container">
      <div className="header">
        <div className="header_left-side">
          <Link className="header_left-side_logo" to="/">
            <img
              alt="logo"
              src="https://ik.imagekit.io/motorolla29/exotic-beds/logo/EB-LOGO-HD.png"
            />
          </Link>
          {ww > 768 ? <HeaderSearchPanel /> : null}
        </div>
        <div className="header_nav">
          {isAuth && user ? (
            <Link to="/account" className="header_nav_account">
              <div className="header_nav_account_icon">
                {user.photo ? (
                  <img
                    src={
                      user.photo ||
                      'https://res.cloudinary.com/ddprwf1qr/image/upload/v1734006782/default-avatar.jpg'
                    }
                    alt="user_photo"
                  />
                ) : (
                  user.name.slice(0, 1).toUpperCase()
                )}
              </div>
              <p className="header_nav_account_title">Account</p>
            </Link>
          ) : (
            <div
              onClick={() => dispatch(loginModalsOpen(true))}
              className="header_nav_login"
            >
              <div className="header_nav_login_icon">
                <UserIcon />
              </div>
              <p className="header_nav_login_title">Sign In</p>
            </div>
          )}
          <Link to="/store-finder" className="header_nav_store-finder">
            <div className="header_nav_store-finder_icon">
              <PinIcon />
            </div>
            <p className="header_nav_lovelist_title">
              {ww > 768 ? 'Find a store' : 'Stores'}
            </p>
          </Link>
          <Link to="/my-lovelist" className="header_nav_lovelist">
            <div className="header_nav_lovelist_icon">
              <HeartIcon />
              {lovelistLength ? (
                <span className="header_nav_lovelist_icon_counter">
                  {lovelistLength}
                </span>
              ) : null}
            </div>
            <p className="header_nav_lovelist_title">
              {ww > 768 ? 'My lovelist' : 'Lovelist'}
            </p>
          </Link>
          <div
            onClick={() => dispatch(cartOpen(true))}
            className="header_nav_basket"
          >
            <div className="header_nav_basket_icon">
              <BasketIcon />
              {basketLength ? (
                <span className="header_nav_basket_icon_counter">
                  {basketLength}
                </span>
              ) : null}
            </div>
            <p className="header_nav_lovelist_title">
              {ww > 768 ? 'My basket' : 'Basket'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
