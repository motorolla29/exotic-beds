import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { getUcFirstNoDashStr } from '../../utils';

import './breadcrumbs.sass';

const Breadcrumbs = ({ category }) => {
  const location = useLocation();

  const matchedRoutes = location.pathname
    .split('/')
    .filter(Boolean)
    .map((route) => decodeURIComponent(route));

  return (
    <div className="breadcrumbs">
      <Link className="breadcrumbs_item" to="/">
        Home
      </Link>
      {category ? (
        <Link className="breadcrumbs_item" to={`/${category}`}>
          {getUcFirstNoDashStr(category)}
        </Link>
      ) : null}
      {matchedRoutes.slice(0, -1).map((route) => (
        <Link
          className="breadcrumbs_item"
          key={route}
          to={`/${encodeURIComponent(route)}`}
        >
          {getUcFirstNoDashStr(route)}
        </Link>
      ))}
      <span className="breadcrumbs_item_last">
        {getUcFirstNoDashStr(matchedRoutes.slice(-1).toString())}
      </span>
    </div>
  );
};

export default Breadcrumbs;
