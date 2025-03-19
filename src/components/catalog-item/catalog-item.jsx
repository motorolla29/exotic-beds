import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import RatingStars from '../rating-stars/rating-stars';
import { randomInteger } from '../../utils';
import {
  cartOpen,
  loginModalsOpen,
  setCart,
  setConfirmationModal,
  setLovelist,
  setProducts,
  setProductsLoaded,
  setSnackbar,
} from '../../store/action';
import HeartIcon from '../heart-icon/heart-icon';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined';
import HeartBrokenOutlined from '@mui/icons-material/HeartBrokenOutlined';
import { TbShoppingCart } from 'react-icons/tb';
import { TbShoppingCartCheck } from 'react-icons/tb';
import useWindowSize from '../../hooks/use-window-size';
import ProgressiveImageContainer from '../progressive-image-container/progressive-image-container';
import { addToBasket } from '../../api/basketAPI';
import { useState } from 'react';
import { AddShoppingCartRounded } from '@mui/icons-material';
import { toggleProductInLovelist } from '../../api/lovelistAPI';
import ClipLoader from 'react-spinners/ClipLoader';
import PuffLoader from 'react-spinners/PuffLoader';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { MdOutlineEdit } from 'react-icons/md';
import DoneIcon from '@mui/icons-material/Done';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AdminEditProductModal from '../admin-modals/admin-edit-product-modal';
import { deleteProduct, getAllProducts } from '../../api/productAPI';
import { deleteImageFromImagekit } from '../../api/imagekitAPI';

import './catalog-item.sass';

const CatalogItem = ({ item, size = '' }) => {
  const dispatch = useDispatch();
  const [ww] = useWindowSize();

  const isAuth = useSelector((state) => state.isAuth);
  const user = useSelector((state) => state.user);
  const [addToBasketLoading, setAddToBasketLoading] = useState(false);
  const [addToLovelistLoading, setAddToLovelistLoading] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const basketItems = useSelector((state) => state.cartProducts);
  const lovedProducts = useSelector((state) => state.lovelistProducts);
  const isInBasket = basketItems.find((it) => it.productId === item.productId);
  const isLoved = lovedProducts.find((it) => it.productId === item.productId);

  const initialStateVariants = [
    { opacity: 0, x: -25 },
    { opacity: 0, x: 25 },
    { opacity: 0, y: -25 },
    { opacity: 0, y: 25 },
  ];

  const onHeartIconClick = () => {
    if (isAuth) {
      setAddToLovelistLoading(true);
      toggleProductInLovelist(item)
        .then((lovelist) => {
          dispatch(setLovelist(lovelist));
          isLoved
            ? dispatch(
                setSnackbar({
                  open: true,
                  decorator: <HeartBrokenOutlined />,
                  text: 'Product is not loved anymore :(',
                  id: item.productId,
                })
              )
            : dispatch(
                setSnackbar({
                  open: true,
                  decorator: <FavoriteBorderOutlined />,
                  text: 'Product is loved now :)',
                  id: item.productId,
                })
              );
        })
        .catch((err) => console.log(err.message))
        .finally(() => setAddToLovelistLoading(false));
    } else {
      dispatch(loginModalsOpen(true));
    }
  };

  const onAddToCartHandler = () => {
    if (isAuth) {
      setAddToBasketLoading(true);
      addToBasket(item)
        .then((cart) => {
          dispatch(setCart(cart));
          dispatch(
            setSnackbar({
              open: true,
              decorator: <AddShoppingCartRounded />,
              text: 'Product added to basket',
              id: item.productId,
            })
          );
        })
        .catch((err) => console.log(err.message))
        .finally(() => setAddToBasketLoading(false));
    } else {
      const localStorageCart = JSON.parse(localStorage.getItem('cart')) || [];
      const localStorageCartItem = localStorageCart.find(
        (it) => it.productId === item.productId
      );
      if (localStorageCartItem) {
        localStorageCartItem.quantity++;
      } else {
        const cartItem = { ...item, quantity: 1 };
        localStorageCart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(localStorageCart));
        dispatch(setCart(localStorageCart));
        dispatch(
          setSnackbar({
            open: true,
            decorator: <AddShoppingCartRounded />,
            text: 'Product added to basket',
            id: item.productId,
          })
        );
      }
    }
  };

  const onDeleteProductConfirm = async () => {
    try {
      await deleteProduct(item.id); // Ожидаем удаления продукта
      if (item.photo) {
        try {
          await deleteImageFromImagekit(item.photo);
        } catch (error) {
          console.error('Error deleting previous image:', error);
        }
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

  return (
    <motion.div
      initial={initialStateVariants[randomInteger(0, 3)]}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5 }}
      key={item.productId}
      className={`catalog-item ${size}`}
    >
      {isAuth && user.role === 'ADMIN' && (
        <>
          <div
            onClick={() => setAdminModalOpen(true)}
            className="catalog-item_admin-edit"
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
            className="catalog-item_admin-delete"
          >
            <RiDeleteBin5Line />
          </div>
        </>
      )}
      <div className="catalog-item_visual">
        <Link to={`/${item.productId}`}>
          <ProgressiveImageContainer
            alt="product_picture"
            thumb={`https://ik.imagekit.io/motorolla29/exotic-beds/catalog/${item.photo}?tr=h-50,w-50,cm-scale`}
            src={`https://ik.imagekit.io/motorolla29/exotic-beds/catalog/${item.photo}?tr=h-350,w-350,cm-scale`}
          />
          {ww > 360 && (
            <>
              {item.isNew ? (
                <img
                  alt="new"
                  src="https://ik.imagekit.io/motorolla29/exotic-beds/card-icons/new.png?tr=w-150"
                  className="catalog-item_visual_new"
                />
              ) : null}
              {item.rating >= 4.9 ? (
                <img
                  alt="top"
                  src="https://ik.imagekit.io/motorolla29/exotic-beds/card-icons/top-rated.png?tr=w-100"
                  className="catalog-item_visual_top-rated"
                />
              ) : null}
              {item.sale ? (
                <img
                  alt="sale"
                  src="https://ik.imagekit.io/motorolla29/exotic-beds/card-icons/sale.png?tr=w-150"
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
            <RatingStars id={item.productId} rating={Number(item.rating)} />
          </div>
          {ww > 385 && (
            <span className="catalog-item_info_rating_mark">
              Rating: {Number(item.rating).toFixed(1)}
            </span>
          )}
        </div>

        <Link to={`/${item.productId}`}>
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
                onClick={onAddToCartHandler}
                title="Add to basket"
                disabled={addToBasketLoading}
              >
                <span>
                  {addToBasketLoading ? (
                    <ClipLoader color="#e9d5be" />
                  ) : (
                    <TbShoppingCart />
                  )}
                  {ww > 360 && 'Add to basket'}
                </span>
              </button>
            )}
            <button
              className="catalog-item_info_ui_lovelist-button"
              onClick={onHeartIconClick}
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
      </div>
      <AnimatePresence>
        {adminModalOpen && (
          <AdminEditProductModal
            isOpen={adminModalOpen}
            onClose={() => setAdminModalOpen(false)}
            item={item}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CatalogItem;
