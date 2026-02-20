import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ClickAwayListener, Tooltip } from '@mui/material';
import { Zoom } from '@mui/material';
import {
  cartOpen,
  setSnackbar,
  setCart,
  loginModalsOpen,
  setLovelist,
  setConfirmationModal,
} from '../../store/action';
import ProgressiveImageContainer from '../progressive-image-container/progressive-image-container';
import {
  addToBasket,
  decrementBasketProduct,
  removeBasketProduct,
} from '../../api/basketAPI';
import { toggleProductInLovelist } from '../../api/lovelistAPI';

import HeartIcon from '../heart-icon/heart-icon';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined';
import HeartBrokenOutlined from '@mui/icons-material/HeartBrokenOutlined';
import { RemoveShoppingCartRounded } from '@mui/icons-material';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import PuffLoader from 'react-spinners/PuffLoader';
import ClipLoader from 'react-spinners/ClipLoader';
import { RiDeleteBin5Line } from 'react-icons/ri';

import './cart-item.sass';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.isAuth);
  const [counterLoading, setCounterLoading] = useState(false);
  const [addToLovelistLoading, setAddToLovelistLoading] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const lovedProducts = useSelector((state) => state.lovelistProducts);
  const isLoved = lovedProducts.find((it) => it.productId === item.productId);

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
                }),
              )
            : dispatch(
                setSnackbar({
                  open: true,
                  decorator: <FavoriteBorderOutlined />,
                  text: 'Product is loved now :)',
                  id: item.productId,
                }),
              );
        })
        .catch((err) => console.log(err.message))
        .finally(() => setAddToLovelistLoading(false));
    } else {
      dispatch(loginModalsOpen(true));
    }
  };

  const onDecreaseButtonClick = () => {
    setTooltipOpen(false);
    if (item.quantity > 1) {
      if (isAuth) {
        setCounterLoading(true);
        decrementBasketProduct(item)
          .then((cart) => {
            dispatch(setCart(cart));
          })
          .catch((err) => console.log(err.message))
          .finally(() => setCounterLoading(false));
      } else {
        const localStorageCart = JSON.parse(localStorage.getItem('cart')) || [];
        const localStorageCartItem = localStorageCart.find(
          (it) => item.productId === it.productId,
        );
        localStorageCartItem.quantity--;
        localStorage.setItem('cart', JSON.stringify(localStorageCart));
        dispatch(setCart(localStorageCart));
      }
    }
  };

  const onIncreaseButtonClick = () => {
    if (item.quantity < item.availableQuantity) {
      if (isAuth) {
        setCounterLoading(true);
        addToBasket(item)
          .then((cart) => {
            dispatch(setCart(cart));
          })
          .catch((err) => console.log(err.message))
          .finally(() => setCounterLoading(false));
      } else {
        const localStorageCart = JSON.parse(localStorage.getItem('cart')) || [];
        const localStorageCartItem = localStorageCart.find(
          (it) => it.productId === item.productId,
        );
        localStorageCartItem.quantity++;
        localStorage.setItem('cart', JSON.stringify(localStorageCart));
        dispatch(setCart(localStorageCart));
      }
    } else {
      setTooltipOpen(true);
    }
  };

  const onRemoveConfirmButton = () => {
    if (isAuth) {
      removeBasketProduct(item)
        .then((cart) => {
          dispatch(setCart(cart));
          dispatch(
            setSnackbar({
              open: true,
              decorator: <RemoveShoppingCartRounded />,
              text: 'Product removed from basket',
              id: item.productId,
            }),
          );
        })
        .catch((err) => console.log(err.message));
    } else {
      const localStorageCart = JSON.parse(localStorage.getItem('cart')) || [];
      const newCart = localStorageCart.filter(
        (it) => it.productId !== item.productId,
      );
      localStorage.setItem('cart', JSON.stringify(newCart));
      dispatch(setCart(newCart));
      dispatch(
        setSnackbar({
          open: true,
          decorator: <RemoveShoppingCartRounded />,
          text: 'Product removed from basket',
          id: item.productId,
        }),
      );
    }
  };

  return (
    <div className="cart-item" key={item.productId}>
      <Link onClick={() => dispatch(cartOpen(false))} to={`/${item.productId}`}>
        <div className="cart-item_photo">
          <ProgressiveImageContainer
            thumb={`https://exotic-beds.s3.cloud.ru/catalog/xs__${item.photo}`}
            src={`https://exotic-beds.s3.cloud.ru/catalog/sm__${item.photo}`}
            alt="cart-item-image"
          />
        </div>
      </Link>
      <div className="cart-item_body">
        <div className="cart-item_body_info">
          <Link
            onClick={() => dispatch(cartOpen(false))}
            to={`/${item.productId}`}
          >
            <div className="cart-item_body_info_title">{item.title}</div>
          </Link>
          {item.sale ? (
            <div className="cart-item_body_info_price">
              <span className="cart-item_body_info_price_last">
                €{item.sale * item.quantity}
              </span>
              <span className="cart-item_body_info_price_first">
                €{item.price * item.quantity}
              </span>
            </div>
          ) : (
            <div className="cart-item_body_info_price">
              <span className="cart-item_body_info_price_last">
                €{item.price * item.quantity}
              </span>
            </div>
          )}
        </div>
        <div className="cart-item_body_ui">
          <button
            onClick={onHeartIconClick}
            className={`cart-item_body_ui_lovelist ${isLoved ? 'loved' : ''}`}
          >
            {addToLovelistLoading ? (
              <PuffLoader color="#cc0000" />
            ) : (
              <HeartIcon isLoved={isLoved} />
            )}
          </button>
          <div className="cart-item_body_ui_right-side">
            <div
              className="cart-item_body_ui_right-side_remove"
              onClick={() =>
                dispatch(
                  setConfirmationModal({
                    open: true,
                    icon: <WarningRoundedIcon />,
                    title: 'Confirmation',
                    description:
                      'Are you sure you want to remove this item from your cart?',
                    yesBtnText: 'Yes, remove it',
                    noBtnText: 'Cancel',
                    action: onRemoveConfirmButton,
                  }),
                )
              }
            >
              <RiDeleteBin5Line />
            </div>
            <ClickAwayListener onClickAway={() => setTooltipOpen(false)}>
              <div className="cart-item_body_ui_right-side_counter">
                <button
                  onClick={onDecreaseButtonClick}
                  className="cart-item_body_ui_right-side_counter_minus"
                  disabled={counterLoading}
                >
                  -
                </button>
                <Tooltip
                  placement="top"
                  TransitionComponent={Zoom}
                  PopperProps={{
                    disablePortal: true,
                  }}
                  onClose={() => setTooltipOpen(false)}
                  open={tooltipOpen}
                  style={{ zIndex: -1 }}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  title={`Only ${item.availableQuantity} available`}
                >
                  <span className="cart-item_body_ui_right-side_counter_value">
                    {counterLoading ? (
                      <ClipLoader color="#4f4a5767" />
                    ) : (
                      item.quantity
                    )}
                  </span>
                </Tooltip>
                <button
                  onClick={onIncreaseButtonClick}
                  className="cart-item_body_ui_right-side_counter_plus"
                  disabled={counterLoading}
                >
                  +
                </button>
              </div>
            </ClickAwayListener>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
