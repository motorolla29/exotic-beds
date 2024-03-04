import { Link } from 'react-router-dom';

import './search-empty.sass';

const SearchEmpty = () => (
  <div className="search-empty">
    <div className="search-empty_description">
      Sorry, there are currently no products matching your request :(
    </div>
    <Link className="search-empty_home" to="/">
      Home
    </Link>
  </div>
);

export default SearchEmpty;
