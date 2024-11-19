import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  decreaseProductAmountInCart,
  increaseProductAmountInCart,
  cartOpen,
  toggleProductInLovelist,
  setSnackbar,
} from '../../store/action';
import HeartIcon from '../heart-icon/heart-icon';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined';
import HeartBrokenOutlined from '@mui/icons-material/HeartBrokenOutlined';

import './cart-item.sass';
import ProgressiveImageContainer from '../progressive-image-container/progressive-image-container';

const CartItem = ({ item, setItemId, setModalOpen }) => {
  const dispatch = useDispatch();
  const lovedProducts = useSelector((state) => state.lovelistProducts);
  const isLoved = lovedProducts.find((it) => it.id === item.id);

  return (
    <div className="cart-item" key={item.id}>
      <Link onClick={() => dispatch(cartOpen(false))} to={`/${item.id}`}>
        <div className="cart-item_photo">
          <ProgressiveImageContainer
            thumb={`https://ik.imagekit.io/motorolla29/exotic-beds/${item.photo}?tr=w-20`}
            src={`https://ik.imagekit.io/motorolla29/exotic-beds/${item.photo}?tr=w-150`}
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
                €{item.sale * item.quantityInCart}
              </span>
              <span className="cart-item_body_info_price_first">
                €{item.price * item.quantityInCart}
              </span>
            </div>
          ) : (
            <div className="cart-item_body_info_price">
              <span className="cart-item_body_info_price_last">
                €{item.price * item.quantityInCart}
              </span>
            </div>
          )}
        </div>
        <div className="cart-item_body_ui">
          <div
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
            className={`cart-item_body_ui_lovelist ${isLoved ? 'loved' : ''}`}
          >
            <HeartIcon isLoved={isLoved} />
          </div>
          <div className="cart-item_body_ui_right-side">
            <span
              onClick={() => {
                setItemId(item.id);
                setModalOpen(true);
              }}
              className="cart-item_body_ui_right-side_remove"
            >
              Remove
            </span>
            <div className="cart-item_body_ui_right-side_counter">
              <span
                onClick={() => dispatch(decreaseProductAmountInCart(item.id))}
                className="cart-item_body_ui_right-side_counter_minus"
              >
                -
              </span>
              <span className="cart-item_body_ui_right-side_counter_value">
                {item.quantityInCart}
              </span>
              <span
                onClick={() => dispatch(increaseProductAmountInCart(item.id))}
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
