import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import RatingStars from '../rating-stars/rating-stars';

import './catalog-item.sass';
import {
  addProductToCart,
  cartOpen,
  toggleProductInLovelist,
} from '../../store/action';
import HeartIcon from '../heart-icon/heart-icon';

const CatalogItem = ({ item }) => {
  const dispatch = useDispatch();

  const basketItems = useSelector((state) => state.cartProducts);
  const lovedProducts = useSelector((state) => state.lovelistProducts);
  const isInBasket = basketItems.find((it) => it.id === item.id);
  const isLoved = lovedProducts.find((it) => it.id === item.id);

  return (
    <div key={item.id} className="catalog-item">
      <div className="catalog-item_visual">
        <Link to={`/${item.id}`}>
          <img
            className="catalog-item_visual_image"
            alt="product_picture"
            src={item.photo}
          />
          {item.new ? (
            <img
              alt="new"
              src="/catalog-card-icons/new.png"
              className="catalog-item_visual_new"
            />
          ) : null}
          {item.rating >= 4.7 ? (
            <img
              alt="top"
              src="/catalog-card-icons/top-rated.png"
              className="catalog-item_visual_top-rated"
            />
          ) : null}
          {item.sale ? (
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
            <RatingStars id={item.id} rating={item.rating} />
          </div>
          <span className="catalog-item_info_rating_mark">
            Rating: {item.rating}
          </span>
        </div>

        <Link to={`/${item.id}`}>
          <p className="catalog-item_info_title">{item.title}</p>
        </Link>
        {item.sale ? (
          <div className="catalog-item_info_price">
            <span className="catalog-item_info_price_final">€{item.sale}</span>
            <span className="catalog-item_info_price_first">€{item.price}</span>
            <span className="catalog-item_info_price_save">
              Save €{item.price - item.sale}
            </span>
          </div>
        ) : (
          <div className="catalog-item_info_price">
            <span className="catalog-item_info_price_final">€{item.price}</span>
          </div>
        )}
        <div className="catalog-item_info_ui">
          {isInBasket ? (
            <button
              className="catalog-item_info_ui_open-cart-button"
              onClick={() => dispatch(cartOpen(true))}
              title="Open cart"
            >
              In the basket
            </button>
          ) : (
            <button
              className="catalog-item_info_ui_add-to-cart-button"
              onClick={() => dispatch(addProductToCart(item.id))}
              title="Add to basket"
            >
              Add to basket
            </button>
          )}
          <button
            className="catalog-item_info_ui_lovelist-button"
            onClick={() => dispatch(toggleProductInLovelist(item.id))}
            title={isLoved ? 'Remove from lovelist' : 'Add to lovelist'}
          >
            <HeartIcon isLoved={isLoved} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogItem;
