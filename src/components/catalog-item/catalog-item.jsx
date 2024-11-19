import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import RatingStars from '../rating-stars/rating-stars';
import { randomInteger } from '../../utils';
import {
  addProductToCart,
  cartOpen,
  setSnackbar,
  toggleProductInLovelist,
} from '../../store/action';
import HeartIcon from '../heart-icon/heart-icon';
import AddShoppingCartRounded from '@mui/icons-material/AddShoppingCartRounded';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined';
import HeartBrokenOutlined from '@mui/icons-material/HeartBrokenOutlined';
import { TbShoppingCart } from 'react-icons/tb';
import { TbShoppingCartCheck } from 'react-icons/tb';
//import { ReactComponent as BasketIcon } from '../../images/ui-icons/basket-icon-btn.svg';
import useWindowSize from '../../hooks/use-window-size';
import ProgressiveImageContainer from '../progressive-image-container/progressive-image-container';

import './catalog-item.sass';

const CatalogItem = ({ item, size = '' }) => {
  const dispatch = useDispatch();
  const [ww] = useWindowSize();

  const basketItems = useSelector((state) => state.cartProducts);
  const lovedProducts = useSelector((state) => state.lovelistProducts);
  const isInBasket = basketItems.find((it) => it.id === item.id);
  const isLoved = lovedProducts.find((it) => it.id === item.id);

  const initialStateVariants = [
    { opacity: 0, x: -25 },
    { opacity: 0, x: 25 },
    { opacity: 0, y: -25 },
    { opacity: 0, y: 25 },
  ];

  return (
    <motion.div
      initial={initialStateVariants[randomInteger(0, 3)]}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5 }}
      key={item.id}
      className={`catalog-item ${size}`}
    >
      <div className="catalog-item_visual">
        <Link to={`/${item.id}`}>
          <ProgressiveImageContainer
            alt="product_picture"
            thumb={`https://ik.imagekit.io/motorolla29/exotic-beds/${item.photo}?tr=w-40`}
            src={`https://ik.imagekit.io/motorolla29/exotic-beds/${item.photo}?tr=w-300`}
          />
          {ww > 360 && (
            <>
              {item.isNew ? (
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
            </>
          )}
        </Link>
      </div>
      <div className="catalog-item_info">
        <div className="catalog-item_info_rating">
          <div className="catalog-item_info_rating_stars">
            <RatingStars id={item.id} rating={item.rating} />
          </div>
          {ww > 385 && (
            <span className="catalog-item_info_rating_mark">
              Rating: {item.rating.toFixed(1)}
            </span>
          )}
        </div>

        <Link to={`/${item.id}`}>
          <p className="catalog-item_info_title">{item.title}</p>
        </Link>
        <div className="catalog-item_info_price-with-ui-container">
          {item.sale ? (
            <div className="catalog-item_info_price">
              <span className="catalog-item_info_price_final">
                €{item.sale}
              </span>
              <span className="catalog-item_info_price_first">
                €{item.price}
              </span>
              {ww > 360 && (
                <span className="catalog-item_info_price_save">
                  Save €{item.price - item.sale}
                </span>
              )}
            </div>
          ) : (
            <div className="catalog-item_info_price">
              <span className="catalog-item_info_price_final">
                €{item.price}
              </span>
            </div>
          )}
          <div className="catalog-item_info_ui">
            {isInBasket ? (
              <button
                className="catalog-item_info_ui_open-cart-button"
                onClick={() => dispatch(cartOpen(true))}
                title="Open cart"
              >
                <span>
                  <TbShoppingCartCheck />
                  {ww > 360 && 'In the basket'}
                </span>
              </button>
            ) : (
              <button
                className="catalog-item_info_ui_add-to-cart-button"
                onClick={() => {
                  dispatch(addProductToCart(item.id));
                  dispatch(
                    setSnackbar({
                      open: true,
                      decorator: <AddShoppingCartRounded />,
                      text: 'Product added to basket',
                      id: item.id,
                    })
                  );
                }}
                title="Add to basket"
              >
                <span>
                  <TbShoppingCart />
                  {ww > 360 && 'Add to basket'}
                </span>
              </button>
            )}
            <button
              className="catalog-item_info_ui_lovelist-button"
              onClick={() => {
                dispatch(toggleProductInLovelist(item.id));
                isLoved
                  ? dispatch(
                      setSnackbar({
                        open: true,
                        decorator: <HeartBrokenOutlined />,
                        text: 'Product is not loved anymore :(',
                        id: item.id,
                      })
                    )
                  : dispatch(
                      setSnackbar({
                        open: true,
                        decorator: <FavoriteBorderOutlined />,
                        text: 'Product is loved now :)',
                        id: item.id,
                      })
                    );
              }}
              title={isLoved ? 'Remove from lovelist' : 'Add to lovelist'}
            >
              <HeartIcon isLoved={isLoved} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CatalogItem;
