import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './breadcrumbs.sass';

const Breadcrumbs = ({ product }) => {
  const category = useSelector((state) => state.category);

  return (
    <div className="breadcrumbs">
      <NavLink to="/" className="breadcrumbs_item">
        Home
      </NavLink>
      {category ? (
        <NavLink to={`/${category.toLowerCase()}`} className="breadcrumbs_item">
          {category}
        </NavLink>
      ) : null}
      {product ? (
        <NavLink className="breadcrumbs_item">{product.title}</NavLink>
      ) : null}
    </div>
  );
};

export default Breadcrumbs;
