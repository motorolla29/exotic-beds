import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HeartBrokenOutlined from '@mui/icons-material/HeartBrokenOutlined';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined';

import { cartOpen, setCart, setSnackbar } from '../../../store/action';
import { toggleProductInLovelist } from '../../../store/action';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import RatingStars from '../../rating-stars/rating-stars';
import HeartIcon from '../../heart-icon/heart-icon';
import { ReactComponent as BasketIcon } from '../../../images/ui-icons/basket-icon-btn.svg';

import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import './product-page.sass';
import ProgressiveImageContainer from '../../progressive-image-container/progressive-image-container';
import { addToBasket } from '../../../api/basketAPI';

const ProductPage = () => {
  const { id } = useParams();
  const isAuth = useSelector((state) => state.isAuth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const products = useSelector((state) => state.products);
  const basketItems = useSelector((state) => state.cartProducts);
  const lovedProducts = useSelector((state) => state.lovelistProducts);
  const product = products.find((it) => it.id === id);
  const isInBasket = basketItems.find((it) => it.id === id);
  const isLoved = lovedProducts.find((it) => it.id === id);

  const addToCartButtonHandler = () => {
    if (isAuth) {
      setLoading(true);
      addToBasket(product)
        .then((cart) => {
          dispatch(setCart(cart));
        })
        .catch((err) => console.log(err.message));
    } else {
      const localStorageCart = JSON.parse(localStorage.getItem('cart')) || [];
      const item = localStorageCart.find((item) => item.id === product.id);
      if (item) {
        item.quantity++;
      } else {
        const cartItem = { ...product, quantity: 1 };
        localStorageCart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(localStorageCart));
        dispatch(setCart(localStorageCart));
      }
    }
  };

  useEffect(() => {
    if (!product) {
      return navigate('/not-found');
    }
  }, [navigate, product]);

  useEffect(() => window.scrollTo(0, 0), [id]);

  return (
    product && (
      <>
        <Breadcrumbs category={product.category} />
        <div className="product-page">
          <div className="product-page_visual">
            <ProgressiveImageContainer
              thumb={`https://ik.imagekit.io/motorolla29/exotic-beds/${product.photo}?tr=w-60`}
              src={`https://ik.imagekit.io/motorolla29/exotic-beds/${product.photo}`}
              alt="product-image"
              withInnerZoom
            />
          </div>
          <div className="product-page_info">
            <div className="product-page_info_title">{product.title}</div>
            <div className="product-page_info_rating">
              <div className="product-page_info_rating_stars">
                <RatingStars id={product.id} rating={product.rating} />
              </div>

              <span className="product-page_info_rating_mark">
                {product.rating.toFixed(1)}
              </span>
            </div>

            <div className="product-page_info_description">
              {product.description}
            </div>

            {product.sale ? (
              <div className="product-page_info_price">
                <div>
                  <span className="product-page_info_price_final">
                    €{product.sale}
                  </span>
                  <span className="product-page_info_price_first">
                    €{product.price}
                  </span>
                </div>
                <span className="product-page_info_price_save">
                  You Save: €{product.price - product.sale} (
                  {Math.round(100 - (product.sale / product.price) * 100)}%)
                </span>
              </div>
            ) : (
              <div className="product-page_info_price">
                <span className="product-page_info_price_final">
                  €{product.price}
                </span>
              </div>
            )}
            <div className="product-page_info_ui">
              {isInBasket ? (
                <button
                  onClick={() => dispatch(cartOpen(true))}
                  className="product-page_info_ui_open-cart-button"
                  title="Open cart"
                >
                  <span>
                    <BasketIcon />
                    In the basket
                  </span>
                </button>
              ) : (
                <button
                  onClick={addToCartButtonHandler}
                  // dispatch(addProductToCart(product.id));
                  // dispatch(
                  //   setSnackbar({
                  //     open: true,
                  //     decorator: <AddShoppingCartRounded />,
                  //     text: 'Product added to basket',
                  //     id: product.id,
                  //   })
                  // );

                  className="product-page_info_ui_add-to-cart-button"
                  title="Add to basket"
                >
                  <span>
                    <BasketIcon />
                    Add to basket
                  </span>
                </button>
              )}

              <button
                onClick={() => {
                  dispatch(toggleProductInLovelist(product.id));
                  isLoved
                    ? dispatch(
                        setSnackbar({
                          open: true,
                          decorator: <HeartBrokenOutlined />,
                          text: 'Product is not loved anymore :(',
                          id: product.id,
                        })
                      )
                    : dispatch(
                        setSnackbar({
                          open: true,
                          decorator: <FavoriteBorderOutlined />,
                          text: 'Product is loved now :)',
                          id: product.id,
                        })
                      );
                }}
                className="product-page_info_ui_lovelist-button"
                title={isLoved ? 'Remove from lovelist' : 'Add to lovelist'}
              >
                <HeartIcon isLoved={isLoved} />
              </button>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default ProductPage;
