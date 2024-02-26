import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  decreaseProductAmountInCart,
  increaseProductAmountInCart,
  removeProductFromCart,
  cartOpen,
  toggleProductInLovelist,
} from '../../store/action';
import HeartIcon from '../heart-icon/heart-icon';

import './cart-item.sass';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const lovedProducts = useSelector((state) => state.lovelistProducts);
  const isLoved = lovedProducts.find((it) => it.id === item.id);

  return (
    <div className="cart-item" key={item.id}>
      <Link onClick={() => dispatch(cartOpen(false))} to={`/${item.id}`}>
        <div className="cart-item_photo">
          <img alt="img" src={item.photo} />
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
            onClick={() => dispatch(toggleProductInLovelist(item.id))}
            className="cart-item_body_ui_lovelist"
          >
            <HeartIcon isLoved={isLoved} />
          </div>
          <div className="cart-item_body_ui_right-side">
            <span
              onClick={() => dispatch(removeProductFromCart(item.id))}
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
              <input
                className="cart-item_body_ui_right-side_counter_input"
                value={item.quantityInCart}
                disabled
              />
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
