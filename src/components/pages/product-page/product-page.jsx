import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

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
  setProducts,
  setProductsLoaded,
  setSnackbar,
} from '../../../store/action';
import { addToBasket } from '../../../api/basketAPI';
import { toggleProductInLovelist } from '../../../api/lovelistAPI';
import ProgressiveImageContainer from '../../progressive-image-container/progressive-image-container';
import { PRODUCT_CATEGORIES } from '../../../const';
import Reviews from '../../reviews/reviews';
import { deleteImageFromImagekit } from '../../../api/imagekitAPI';
import { deleteProduct, getAllProducts } from '../../../api/productAPI';
import AdminEditProductModal from '../../admin-modals/admin-edit-product-modal';

import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import './product-page.sass';

const ProductPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const isAuth = useSelector((state) => state.isAuth);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [addToBasketLoading, setAddToBasketLoading] = useState(false);
  const [addToLovelistLoading, setAddToLovelistLoading] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const products = useSelector((state) => state.products);
  const basketItems = useSelector((state) => state.cartProducts);
  const lovedProducts = useSelector((state) => state.lovelistProducts);
  const product = products.find((it) => it.id === id);
  const isInBasket = basketItems.find((it) => it.productId === id);
  const isLoved = lovedProducts.find((it) => it.productId === id);

  const onHeartIconClick = () => {
    if (isAuth) {
      setAddToLovelistLoading(true);
      toggleProductInLovelist({ ...product, productId: product.id })
        .then((lovelist) => {
          dispatch(setLovelist(lovelist));
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
        })
        .catch((err) => console.log(err.message))
        .finally(() => setAddToLovelistLoading(false));
    } else {
      dispatch(loginModalsOpen(true));
    }
  };

  const addToCartButtonHandler = () => {
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
            })
          );
        })
        .catch((err) => console.log(err.message))
        .finally(() => setAddToBasketLoading(false));
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
        dispatch(
          setSnackbar({
            open: true,
            decorator: <AddShoppingCartRounded />,
            text: 'Product added to basket',
            id: product.id,
          })
        );
      }
    }
  };

  const onDeleteProductConfirm = async () => {
    try {
      await deleteProduct(product.id); // Ожидаем удаления продукта
      if (product.photo) {
        try {
          await deleteImageFromImagekit(product.photo);
        } catch (error) {
          console.error('Error deleting previous image:', error);
        }
      }
      if (location.state?.from) {
        navigate(location.state.from, { replace: true });
      } else {
        navigate('/beds', { replace: true });
      }
      dispatch(setProductsLoaded(false));
      const productData = await getAllProducts();
      dispatch(setProducts(productData.rows));
      dispatch(setProductsLoaded(true));
      dispatch(
        setSnackbar({
          open: true,
          text: 'Product successfully deleted',
          decorator: <DoneIcon />,
        })
      );
    } catch (error) {
      console.log(error);
      return;
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
        <Breadcrumbs category={PRODUCT_CATEGORIES[product.categoryId - 1]} />
        <div className="product-page">
          <div className="product-page_visual">
            <div
              style={{ position: 'relative', width: '100%', height: '100%' }}
            >
              <ProgressiveImageContainer
                thumb={`https://ik.imagekit.io/motorolla29/exotic-beds/catalog/${product.photo}?tr=w-60`}
                src={`https://ik.imagekit.io/motorolla29/exotic-beds/catalog/${product.photo}`}
                alt="product-image"
                withInnerZoom
              />
              {product.availableQuantity === 0 && (
                <img
                  className="product-page_visual_sold-out"
                  src="https://ik.imagekit.io/motorolla29/exotic-beds/card-icons/sold-out.svg?tr=f-png"
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
                        })
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
              <div className="product-page_main_info_title">
                {product.title}
              </div>
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
              />
            )}
          </AnimatePresence>
        </div>
      </>
    )
  );
};

export default ProductPage;
