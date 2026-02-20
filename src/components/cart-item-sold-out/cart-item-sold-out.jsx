import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSnackbar,
  setCart,
  setConfirmationModal,
  setLovelist,
  loginModalsOpen,
} from '../../store/action';
import ProgressiveImageContainer from '../progressive-image-container/progressive-image-container';
import { removeBasketProduct } from '../../api/basketAPI';
import { toggleProductInLovelist } from '../../api/lovelistAPI';

import HeartIcon from '../heart-icon/heart-icon';
import PuffLoader from 'react-spinners/PuffLoader';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined';
import HeartBrokenOutlined from '@mui/icons-material/HeartBrokenOutlined';
import { RemoveShoppingCartRounded } from '@mui/icons-material';
import { RiDeleteBin5Line } from 'react-icons/ri';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

import './cart-item-sold-out.sass';

const CartItemSoldOut = ({ item }) => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.isAuth);

  const [addToLovelistLoading, setAddToLovelistLoading] = useState(false);
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
    <div className="cart-item-sold-out" key={item.productId}>
      <div className="cart-item-sold-out_photo">
        <ProgressiveImageContainer
          thumb={`https://exotic-beds.s3.cloud.ru/catalog/xs__${item.photo}`}
          src={`https://exotic-beds.s3.cloud.ru/catalog/sm__${item.photo}`}
          alt="cart-item-sold-out-image"
        />
        <img
          className="cart-item-sold-out_photo_sign"
          src="https://exotic-beds.s3.cloud.ru/card-icons/sm__sold-out.png"
          alt="sold-out-sign"
        />
      </div>
      <div className="cart-item-sold-out_body">
        <div className="cart-item-sold-out_body_info">
          <div className="cart-item-sold-out_body_info_title">{item.title}</div>
        </div>
        <div className="cart-item-sold-out_body_ui">
          <button
            onClick={onHeartIconClick}
            className={`cart-item-sold-out_body_ui_lovelist ${
              isLoved ? 'loved' : ''
            }`}
          >
            {addToLovelistLoading ? (
              <PuffLoader color="#cc0000" />
            ) : (
              <HeartIcon isLoved={isLoved} />
            )}
          </button>
          <div className="cart-item-sold-out_body_ui_right-side">
            <div
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
              className="cart-item-sold-out_body_ui_right-side_remove"
            >
              <RiDeleteBin5Line />
            </div>
          </div>
        </div>
      </div>
    </div>
    /* <div
        onClick={onDeleteButton}
        className="cart-item-sold-out_container_delete"
      >
        <RiDeleteBin5Line />
      </div> */
  );
};

export default CartItemSoldOut;
