import { ReactComponent as SearchIcon } from '../../images/ui-icons/3844432-magnifier-search-zoom_110300.svg';

import './header.sass';

const Header = () => {
  return (
    <div className="header">
      <div className="header_content">
        <div className="header_content_search-panel">
          <button className="header_content_search-panel_button">
            <SearchIcon />
          </button>
          <input className="header_content_search-panel_input"></input>
        </div>
        <div className="header_content_logo">logo</div>
        <div className="header_content_nav">nav</div>
      </div>
    </div>
  );
};

export default Header;
