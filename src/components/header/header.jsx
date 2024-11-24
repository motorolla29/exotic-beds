import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { cartOpen, signInModalOpen } from '../../store/action';
import HeaderSearchPanel from '../header-search-panel/header-serach-panel';
import useWindowSize from '../../hooks/use-window-size';

import { ReactComponent as BasketIcon } from '../../images/ui-icons/basket-icon.svg';
import { ReactComponent as HeartIcon } from '../../images/ui-icons/heart-icon.svg';
import { ReactComponent as PinIcon } from '../../images/ui-icons/pin-icon.svg';
import { ReactComponent as UserIcon } from '../../images/ui-icons/user-icon.svg';

import './header.sass';

const Header = () => {
  const dispatch = useDispatch();

  const lovelistLength = useSelector((state) => state.lovelistProducts.length);
  const basketLength = useSelector((state) => {
    return state.cartProducts.reduce(
      (acc, currentValue) => acc + currentValue.quantityInCart,
      0
    );
  });

  const [ww, wh] = useWindowSize();

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
          <div className="header_nav_login">
            <div
              onClick={() => dispatch(signInModalOpen(true))}
              className="header_nav_login_icon"
            >
              <UserIcon />
            </div>
            <p className="header_nav_login_title">Sign In</p>
          </div>
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
