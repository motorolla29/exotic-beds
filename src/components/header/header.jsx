import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cartOpen } from '../../store/action';

import { ReactComponent as SearchIcon } from '../../images/ui-icons/search-icon.svg';
import { ReactComponent as BasketIcon } from '../../images/ui-icons/basket-icon.svg';
import { ReactComponent as HeartIcon } from '../../images/ui-icons/heart-icon.svg';
import { ReactComponent as PinIcon } from '../../images/ui-icons/pin-icon.svg';

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

  return (
    <div className="header">
      <div className="header_left-side">
        <Link className="header_left-side_logo" to="/">
          <img alt="logo" src="/logo/EB-LOGO-HD.png" />
        </Link>
        <form className="header_left-side_search-form">
          <button type="submit" className="header_left-side_search-form_button">
            <SearchIcon />
          </button>
          <input
            type="text"
            className="header_left-side_search-form_input"
          ></input>
        </form>
      </div>
      <div className="header_nav">
        <Link to="/store-finder" className="header_nav_store-finder">
          <div className="header_nav_store-finder_icon">
            <PinIcon />
          </div>
          <p className="header_nav_lovelist_title">Find a store</p>
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
          <p className="header_nav_lovelist_title">My lovelist</p>
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
          <p className="header_nav_lovelist_title">My basket</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
