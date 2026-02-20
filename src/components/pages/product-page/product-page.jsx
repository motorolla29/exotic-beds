import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

import HeartBrokenOutlined from '@mui/icons-material/HeartBrokenOutlined';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined';
import HeartIcon from '../../heart-icon/heart-icon';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { MdOutlineEdit } from 'react-icons/md';
import ClipLoader from 'react-spinners/ClipLoader';
import PuffLoader from 'react-spinners/PuffLoader';
import DoneIcon from '@mui/icons-material/Done';
import { TbShoppingCart, TbShoppingCartCheck } from 'react-icons/tb';
import { AddShoppingCartRounded } from '@mui/icons-material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import RatingStars from '../../rating-stars/rating-stars';
import {
  cartOpen,
  loginModalsOpen,
  setCart,
  setConfirmationModal,
  setLovelist,
  setSnackbar,
} from '../../../store/action';
import { addToBasket } from '../../../api/basketAPI';
import { toggleProductInLovelist } from '../../../api/lovelistAPI';
import ProgressiveImageContainer from '../../progressive-image-container/progressive-image-container';
import { PRODUCT_CATEGORIES } from '../../../const';
import Reviews from '../../reviews/reviews';
import { deleteImageFromCloud } from '../../../api/cloudAPI';
import { deleteProduct, getProduct } from '../../../api/productAPI';
import AdminEditProductModal from '../../admin-modals/admin-edit-product-modal';

import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import './product-page.sass';
import LogoSpinner from '../../logo-spinner/logo-spinner';

const ProductPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuth = useSelector((state) => state.isAuth);
  const user = useSelector((state) => state.user);
  const basketItems = useSelector((state) => state.cartProducts);
  const lovedProducts = useSelector((state) => state.lovelistProducts);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [addToBasketLoading, setAddToBasketLoading] = useState(false);
  const [addToLovelistLoading, setAddToLovelistLoading] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const isInBasket = basketItems.find((it) => it.productId === id);
  const isLoved = lovedProducts.find((it) => it.productId === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    getProduct(id)
      .then((data) => {
        if (!data) {
          navigate('/not-found', { replace: true });
        } else {
          setProduct(data);
        }
      })
      .catch(() => {
        navigate('/not-found', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const onHeartIconClick = () => {
    if (!product) return;
    if (isAuth) {
      setAddToLovelistLoading(true);
      toggleProductInLovelist({ ...product, productId: product.id })
        .then((lovelist) => {
          dispatch(setLovelist(lovelist));
          dispatch(
            setSnackbar({
              open: true,
              decorator: isLoved ? (
                <HeartBrokenOutlined />
              ) : (
                <FavoriteBorderOutlined />
              ),
              text: isLoved
                ? 'Product removed from lovelist'
                : 'Product added to lovelist',
              id: product.id,
            }),
          );
        })
        .catch((err) => console.log(err.message))
        .finally(() => setAddToLovelistLoading(false));
    } else {
      dispatch(loginModalsOpen(true));
    }
  };

  const addToCartButtonHandler = () => {
    if (!product) return;
    if (isAuth) {
      setAddToBasketLoading(true);
      addToBasket({ ...product, productId: product.id })
        .then((cart) => {
          dispatch(setCart(cart));
          dispatch(
            setSnackbar({
              open: true,
              decorator: <AddShoppingCartRounded />,
              text: 'Product added to basket',
              id: product.id,
            }),
          );
        })
        .catch((err) => console.log(err.message))
        .finally(() => setAddToBasketLoading(false));
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      const item = localCart.find((item) => item.id === product.id);
      if (item) {
        item.quantity++;
      } else {
        localCart.push({ ...product, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(localCart));
        dispatch(setCart(localCart));
        dispatch(
          setSnackbar({
            open: true,
            decorator: <AddShoppingCartRounded />,
            text: 'Product added to basket',
            id: product.id,
          }),
        );
      }
    }
  };

  const onDeleteProductConfirm = async () => {
    if (!product) return;
    try {
      await deleteProduct(product.id); // Ожидаем удаления продукта
      if (product.photo) {
        try {
          await deleteImageFromCloud(product.photo);
        } catch (error) {
          console.error('Error deleting previous image:', error);
        }
      }
      navigate(location.state?.from || '/beds', { replace: true });
      dispatch(
        setSnackbar({
          open: true,
          text: 'Product successfully deleted',
          decorator: <DoneIcon />,
        }),
      );
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return !loading && product ? (
    <>
      <Helmet>
        <title>{product.title}</title>
      </Helmet>
      <Breadcrumbs category={PRODUCT_CATEGORIES[product.categoryId - 1]} />
      <div className="product-page">
        <div className="product-page_visual">
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <ProgressiveImageContainer
              thumb={`https://exotic-beds.s3.cloud.ru/catalog/xs__${product.photo}`}
              src={`https://exotic-beds.s3.cloud.ru/catalog/${product.photo}`}
              alt="product-image"
              withInnerZoom
            />
            {product.availableQuantity === 0 && (
              <img
                className="product-page_visual_sold-out"
                src="https://exotic-beds.s3.cloud.ru/card-icons/sold-out.png"
                alt="sold-out"
              />
            )}
            {isAuth && user.role === 'ADMIN' && (
              <>
                <div
                  onClick={() => setAdminModalOpen(true)}
                  className="product-page_visual_admin-edit"
                >
                  <MdOutlineEdit />
                </div>
                <div
                  onClick={() => {
                    dispatch(
                      setConfirmationModal({
                        open: true,
                        icon: <DeleteForeverIcon />,
                        title: 'Delete Product?',
                        description:
                          'Are you sure you want to delete this product? It will not be possible to restore it...',
                        yesBtnText: 'Delete',
                        noBtnText: 'Cancel',
                        action: onDeleteProductConfirm,
                      }),
                    );
                  }}
                  className="product-page_visual_admin-delete"
                >
                  <RiDeleteBin5Line />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="product-page_main">
          <div className="product-page_main_info">
            <div className="product-page_main_info_title">{product.title}</div>
            <div className="product-page_main_info_rating">
              <div className="product-page_main_info_rating_stars">
                <RatingStars id={product.id} rating={product.rating} />
              </div>

              <span className="product-page_main_info_rating_mark">
                {product.rating.toFixed(1)}
              </span>
            </div>

            <div className="product-page_main_info_description">
              {product.description}
            </div>

            {product.sale ? (
              <div className="product-page_main_info_price">
                <div>
                  <span className="product-page_main_info_price_final">
                    €{product.sale}
                  </span>
                  <span className="product-page_main_info_price_first">
                    €{product.price}
                  </span>
                </div>
                <span className="product-page_main_info_price_save">
                  You Save: €{product.price - product.sale} (
                  {Math.round(100 - (product.sale / product.price) * 100)}%)
                </span>
              </div>
            ) : (
              <div className="product-page_main_info_price">
                <span className="product-page_main_info_price_final">
                  €{product.price}
                </span>
              </div>
            )}
            <div className="product-page_main_info_ui">
              {product.availableQuantity === 0 ? (
                <div className="product-page_main_info_ui_sold-out">
                  Sold out
                </div>
              ) : (
                <>
                  {isInBasket ? (
                    <button
                      onClick={() => dispatch(cartOpen(true))}
                      className="product-page_main_info_ui_open-cart-button"
                      title="Open cart"
                    >
                      <span>
                        <TbShoppingCartCheck />
                        In the basket
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={addToCartButtonHandler}
                      className="product-page_main_info_ui_add-to-cart-button"
                      title="Add to basket"
                      disabled={addToBasketLoading}
                    >
                      <span>
                        {addToBasketLoading ? (
                          <ClipLoader color="#e9d5be" />
                        ) : (
                          <TbShoppingCart />
                        )}
                        Add to basket
                      </span>
                    </button>
                  )}
                </>
              )}

              <button
                onClick={onHeartIconClick}
                className="product-page_main_info_ui_lovelist-button"
                title={isLoved ? 'Remove from lovelist' : 'Add to lovelist'}
                disabled={addToLovelistLoading}
              >
                {addToLovelistLoading ? (
                  <PuffLoader color="#cc0000" />
                ) : (
                  <HeartIcon isLoved={isLoved} />
                )}
              </button>
            </div>
          </div>
          <div className="product-page_main_reviews">
            <Reviews product={product} />
          </div>
        </div>
        <AnimatePresence>
          {adminModalOpen && (
            <AdminEditProductModal
              isOpen={adminModalOpen}
              onClose={() => setAdminModalOpen(false)}
              item={product}
              onSave={(updatedProduct) => setProduct(updatedProduct)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  ) : (
    <div className="product-page_loader">
      <LogoSpinner />
    </div>
  );
};

export default ProductPage;
