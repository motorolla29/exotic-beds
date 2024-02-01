import { useDispatch, useSelector } from 'react-redux';
import { changeCategory } from '../../../store/action';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import Tabs from '../../tabs/tabs';

import './catalog-page.sass';

const CatalogPage = ({ category }) => {
  const dispatch = useDispatch();

  dispatch(changeCategory(category));

  const products = useSelector((state) => state.products).filter(
    (it) => it.category === category.toLowerCase()
  );

  return (
    <div className="catalog-page">
      <Tabs />
      <Breadcrumbs category={category} />
      {products.map((it) => {
        return (
          <div key={it.id} className="catalog-item">
            <Link to={`/${it.id}`}>
              <img
                alt="product_picture"
                className="catalog-item_image"
                src={it.photo}
              />
            </Link>
            <Link to={`/${it.id}`}>
              <p className="catalog-item_title">{it.title}</p>
            </Link>
            <p className="catalog-item_price">{it.price}</p>
            <button></button>
          </div>
        );
      })}
    </div>
  );
};

export default CatalogPage;
