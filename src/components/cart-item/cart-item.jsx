import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  cartOpen,
  setSnackbar,
  setCart,
  loginModalsOpen,
  setLovelist,
  setConfirmationModal,
} from '../../store/action';
import HeartIcon from '../heart-icon/heart-icon';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined';
import HeartBrokenOutlined from '@mui/icons-material/HeartBrokenOutlined';
import ProgressiveImageContainer from '../progressive-image-container/progressive-image-container';
import {
  addToBasket,
  decrementBasketProduct,
  removeBasketProduct,
} from '../../api/basketAPI';
//import { useState } from 'react';
import { toggleProductInLovelist } from '../../api/lovelistAPI';
import { RemoveShoppingCartRounded } from '@mui/icons-material';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

import './cart-item.sass';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.isAuth);
  //const [counterLoading, setCounterLoading] = useState(false);
  const lovedProducts = useSelector((state) => state.lovelistProducts);
  const isLoved = lovedProducts.find((it) => it.id === item.id);

  const onHeartIconClick = () => {
    if (isAuth) {
      toggleProductInLovelist(item).then((lovelist) => {
        dispatch(setLovelist(lovelist));
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
      });
    } else {
      dispatch(loginModalsOpen(true));
    }
  };

  const onDecreaseButtonClick = () => {
    if (item.quantity > 1) {
      if (isAuth) {
        //setCounterLoading(true);
        decrementBasketProduct(item)
          .then((cart) => {
            dispatch(setCart(cart));
          })
          .catch((err) => console.log(err.message));
        //.finally(() => setCounterLoading(false));
      } else {
        const localStorageCart = JSON.parse(localStorage.getItem('cart')) || [];
        const localStorageCartItem = localStorageCart.find(
          (it) => item.id === it.id
        );
        localStorageCartItem.quantity--;
        localStorage.setItem('cart', JSON.stringify(localStorageCart));
        dispatch(setCart(localStorageCart));
      }
    }
  };

  const onIncreaseButtonClick = () => {
    if (isAuth) {
      //setCounterLoading(true);
      addToBasket(item)
        .then((cart) => {
          dispatch(setCart(cart));
        })
        .catch((err) => console.log(err.message));
      //.finally(() => setCounterLoading(false));
    } else {
      const localStorageCart = JSON.parse(localStorage.getItem('cart')) || [];
      const localStorageCartItem = localStorageCart.find(
        (it) => item.id === it.id
      );
      localStorageCartItem.quantity++;
      localStorage.setItem('cart', JSON.stringify(localStorageCart));
      dispatch(setCart(localStorageCart));
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
              id: item.id,
            })
          );
        })
        .catch((err) => console.log(err.message));
    } else {
      const localStorageCart = JSON.parse(localStorage.getItem('cart')) || [];
      const newCart = localStorageCart.filter((it) => it.id !== item.id);
      localStorage.setItem('cart', JSON.stringify(newCart));
      dispatch(setCart(newCart));
      dispatch(
        setSnackbar({
          open: true,
          decorator: <RemoveShoppingCartRounded />,
          text: 'Product removed from basket',
          id: item.id,
        })
      );
    }
  };

  return (
    <div className="cart-item" key={item.id}>
      <Link onClick={() => dispatch(cartOpen(false))} to={`/${item.id}`}>
        <div className="cart-item_photo">
          <ProgressiveImageContainer
            thumb={`https://ik.imagekit.io/motorolla29/exotic-beds/catalog/${item.photo}?tr=w-20`}
            src={`https://ik.imagekit.io/motorolla29/exotic-beds/catalog/${item.photo}?tr=w-150`}
            alt="cart-item-image"
          />
        </div>
      </Link>
      <div className="cart-item_body">
        <div className="cart-item_body_info">
          <Link onClick={() => dispatch(cartOpen(false))} to={`/${item.id}`}>
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
          <div
            onClick={onHeartIconClick}
            className={`cart-item_body_ui_lovelist ${isLoved ? 'loved' : ''}`}
          >
            <HeartIcon isLoved={isLoved} />
          </div>
          <div className="cart-item_body_ui_right-side">
            <span
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
                  })
                )
              }
              className="cart-item_body_ui_right-side_remove"
            >
              Remove
            </span>
            <div className="cart-item_body_ui_right-side_counter">
              <span
                onClick={onDecreaseButtonClick}
                className="cart-item_body_ui_right-side_counter_minus"
              >
                -
              </span>
              <span className="cart-item_body_ui_right-side_counter_value">
                {item.quantity}
              </span>
              <span
                onClick={onIncreaseButtonClick}
                className="cart-item_body_ui_right-side_counter_plus"
              >
                +
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
