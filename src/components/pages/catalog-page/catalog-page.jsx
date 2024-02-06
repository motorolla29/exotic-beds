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
    <>
      <Tabs />
      <Breadcrumbs />
      <div className="catalog-page">
        {products.map((it) => {
          return (
            <div key={it.id} className="catalog-item">
              <div className="catalog-item_visual">
                <Link to={`/${it.id}`}>
                  <img
                    className="catalog-item_visual_image"
                    alt="product_picture"
                    src={it.photo}
                  />
                </Link>
                <img
                  alt="new"
                  src="/catalog-card-icons/new.png"
                  className="catalog-item_visual_new"
                />
                <img
                  alt="top"
                  src="/catalog-card-icons/top-rated.png"
                  className="catalog-item_visual_top-rated"
                />
                <img
                  alt="sale"
                  src="/catalog-card-icons/sale.png"
                  className="catalog-item_visual_sale"
                />
              </div>
              <div className="catalog-item_info">
                <div>stars</div>
                <Link className="catalog-item_info_title" to={`/${it.id}`}>
                  {it.title}
                </Link>
                <div className="catalog-item_info_price">€{it.price}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CatalogPage;
