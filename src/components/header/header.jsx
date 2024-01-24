import { Link } from 'react-router-dom';

import { ReactComponent as SearchIcon } from '../../images/ui-icons/search-icon.svg';
import { ReactComponent as BasketIcon } from '../../images/ui-icons/basket-icon.svg';
import { ReactComponent as HeartIcon } from '../../images/ui-icons/heart-icon.svg';
import { ReactComponent as PinIcon } from '../../images/ui-icons/pin-icon.svg';

import './header.sass';

const Header = () => {
  return (
    <div className="header">
      <div className="header_content">
        <div className="header_content_search-form_container">
          <form className="header_content_search-form">
            <button type="submit" className="header_content_search-form_button">
              <SearchIcon />
            </button>
            <input
              type="text"
              className="header_content_search-form_input"
            ></input>
          </form>
        </div>

        <div className="header_content_logo">
          <Link to="/">Logo</Link>
        </div>
        <div className="header_content_nav">
          <Link to="/store-finder" className="header_content_nav_store-finder">
            <div className="header_content_nav_store-finder_icon">
              <PinIcon />
            </div>
            <p className="header_content_nav_lovelist_title">Find a store</p>
          </Link>
          <Link to="/my-lovelist" className="header_content_nav_lovelist">
            <div className="header_content_nav_lovelist_icon">
              <HeartIcon />
              <span className="header_content_nav_lovelist_icon_counter">
                3
              </span>
            </div>
            <p className="header_content_nav_lovelist_title">My lovelist</p>
          </Link>
          <Link to="/cart" className="header_content_nav_basket">
            <div className="header_content_nav_basket_icon">
              <BasketIcon />
              <span className="header_content_nav_basket_icon_counter">1</span>
            </div>
            <p className="header_content_nav_lovelist_title">My basket</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
