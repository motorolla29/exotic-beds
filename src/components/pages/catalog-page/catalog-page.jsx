import { useDispatch, useSelector } from 'react-redux';
import { changeCategory } from '../../../store/action';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import Tabs from '../../tabs/tabs';
import RatingStars from '../../rating-stars/rating-stars';

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
        <div className="catalog">
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
                    <img
                      alt="new"
                      src="/catalog-card-icons/new.png"
                      className="catalog-item_visual_new"
                    />
                    {it.rating >= 4.7 ? (
                      <img
                        alt="top"
                        src="/catalog-card-icons/top-rated.png"
                        className="catalog-item_visual_top-rated"
                      />
                    ) : null}
                    {it.sale ? (
                      <img
                        alt="sale"
                        src="/catalog-card-icons/sale.png"
                        className="catalog-item_visual_sale"
                      />
                    ) : null}
                  </Link>
                </div>
                <div className="catalog-item_info">
                  <div className="catalog-item_info_rating">
                    <div className="catalog-item_info_rating_stars">
                      <RatingStars id={it.id} rating={it.rating} />
                    </div>
                    <span className="catalog-item_info_rating_mark">
                      Rating: {it.rating}
                    </span>
                  </div>

                  <Link to={`/${it.id}`}>
                    <div className="catalog-item_info_title">{it.title}</div>
                  </Link>
                  {it.sale ? (
                    <div className="catalog-item_info_price">
                      <span className="catalog-item_info_price_final">
                        €{it.sale}
                      </span>
                      <span className="catalog-item_info_price_first">
                        €{it.price}
                      </span>
                      <span className="catalog-item_info_price_save">
                        Save €{it.price - it.sale}
                      </span>
                    </div>
                  ) : (
                    <div className="catalog-item_info_price">
                      <span className="catalog-item_info_price_final">
                        €{it.price}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CatalogPage;
