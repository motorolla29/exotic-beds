import { useDispatch, useSelector } from 'react-redux';
import { setSnackbar, setCart } from '../../store/action';
import ProgressiveImageContainer from '../progressive-image-container/progressive-image-container';
import { removeBasketProduct } from '../../api/basketAPI';
import { RemoveShoppingCartRounded } from '@mui/icons-material';
import { RiDeleteBin5Line } from 'react-icons/ri';

import './cart-item-sold-out.sass';

const CartItemSoldOut = ({ item }) => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.isAuth);

  const onDeleteButton = () => {
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
            })
          );
        })
        .catch((err) => console.log(err.message));
    } else {
      const localStorageCart = JSON.parse(localStorage.getItem('cart')) || [];
      const newCart = localStorageCart.filter(
        (it) => it.productId !== item.productId
      );
      localStorage.setItem('cart', JSON.stringify(newCart));
      dispatch(setCart(newCart));
      dispatch(
        setSnackbar({
          open: true,
          decorator: <RemoveShoppingCartRounded />,
          text: 'Product removed from basket',
          id: item.productId,
        })
      );
    }
  };

  return (
    <div className="cart-item-sold-out_container">
      <div className="cart-item-sold-out" key={item.productId}>
        <div className="cart-item-sold-out_photo">
          <ProgressiveImageContainer
            thumb={`https://ik.imagekit.io/motorolla29/exotic-beds/catalog/${item.photo}?tr=w-20`}
            src={`https://ik.imagekit.io/motorolla29/exotic-beds/catalog/${item.photo}?tr=w-150`}
            alt="cart-item-sold-out-image"
          />
          <img
            className="cart-item-sold-out_photo_sign"
            src="https://ik.imagekit.io/motorolla29/exotic-beds/card-icons/sold-out.svg?tr=f-png"
            alt="sold-out-sign"
          />
        </div>
        <div className="cart-item-sold-out_body">
          <div className="cart-item-sold-out_body_info">
            <div className="cart-item-sold-out_body_info_title">
              {item.title}
            </div>
            {item.sale ? (
              <div className="cart-item-sold-out_body_info_price">
                <span className="cart-item-sold-out_body_info_price_last">
                  €{item.sale * item.quantity}
                </span>
                <span className="cart-item-sold-out_body_info_price_first">
                  €{item.price * item.quantity}
                </span>
              </div>
            ) : (
              <div className="cart-item-sold-out_body_info_price">
                <span className="cart-item-sold-out_body_info_price_last">
                  €{item.price * item.quantity}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        onClick={onDeleteButton}
        className="cart-item-sold-out_container_delete"
      >
        <RiDeleteBin5Line />
      </div>
    </div>
  );
};

export default CartItemSoldOut;
