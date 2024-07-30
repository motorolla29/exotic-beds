import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AddShoppingCartRounded from '@mui/icons-material/AddShoppingCartRounded';
import HeartBrokenOutlined from '@mui/icons-material/HeartBrokenOutlined';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined';

import { addProductToCart, cartOpen, setSnackbar } from '../../../store/action';
import { toggleProductInLovelist } from '../../../store/action';
import InnerImageZoom from 'react-inner-image-zoom';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import RatingStars from '../../rating-stars/rating-stars';
import HeartIcon from '../../heart-icon/heart-icon';
import { ReactComponent as BasketIcon } from '../../../images/ui-icons/basket-icon-btn.svg';

import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import './product-page.sass';

const ProductPage = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector((state) => state.products);
  const basketItems = useSelector((state) => state.cartProducts);
  const lovedProducts = useSelector((state) => state.lovelistProducts);
  const product = products.find((it) => it.id === id);
  const isInBasket = basketItems.find((it) => it.id === id);
  const isLoved = lovedProducts.find((it) => it.id === id);

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
            <InnerImageZoom
              fullscreenOnMobile={true}
              hideCloseButton={true}
              className="product-page_image"
              alt="product_picture"
              src={product.photo}
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
                  <BasketIcon />
                  <span>In the basket</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    dispatch(addProductToCart(product.id));
                    dispatch(
                      setSnackbar({
                        open: true,
                        decorator: <AddShoppingCartRounded />,
                        text: 'Product added to basket',
                        id: product.id,
                      })
                    );
                  }}
                  className="product-page_info_ui_add-to-cart-button"
                  title="Add to basket"
                >
                  <BasketIcon />
                  <span>Add to basket</span>
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
