import './cart-item.sass';

import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  decreaseProductAmountInCart,
  increaseProductAmountInCart,
  removeProductFromCart,
  setIsCartOpen,
  toggleProductInLovelist,
} from '../../store/action';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const lovedProducts = useSelector((state) => state.lovelistProducts);
  const isLoved = lovedProducts.find((it) => it.id === item.id);

  return (
    <div className="cart-item" key={item.id}>
      <Link onClick={() => dispatch(setIsCartOpen(false))} to={`/${item.id}`}>
        <div className="cart-item_photo">
          <img alt="img" src={item.photo} />
        </div>
      </Link>
      <div className="cart-item_body">
        <div className="cart-item_body_info">
          <Link
            onClick={() => dispatch(setIsCartOpen(false))}
            to={`/${item.id}`}
          >
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
            <svg
              width="10%"
              height="10%"
              viewBox="0 0 676 608"
              fill={isLoved ? 'red' : 'none'}
              stroke={isLoved ? 'red' : 'grey'}
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path d="M494.533 0C426.4 0 367.567 39.9 338 98.1C308.433 39.9 249.6 0 181.467 0C83.8 0 4.66663 81.9 4.66663 182.7C4.66663 283.5 65.2333 375.9 143.5 451.8C221.767 527.7 338 600 338 600C338 600 450.467 528.9 532.5 451.8C620 369.6 671.333 283.8 671.333 182.7C671.333 81.6 592.2 0 494.533 0Z" />
                <path d="M337.554 98.3265L338 99.2039L338.446 98.3265C367.934 40.2805 426.603 0.5 494.533 0.5C591.909 0.5 670.833 81.8609 670.833 182.7C670.833 283.607 619.605 369.285 532.158 451.436L532.475 451.773L532.157 451.436C491.164 489.964 442.56 526.999 404.197 554.406C385.017 568.108 368.399 579.402 356.578 587.27C350.667 591.204 345.955 594.281 342.721 596.375C341.104 597.421 339.857 598.222 339.014 598.761C338.592 599.031 338.272 599.235 338.057 599.372L337.998 599.409L337.929 599.366C337.707 599.228 337.377 599.02 336.942 598.746C336.072 598.199 334.786 597.386 333.122 596.324C329.792 594.199 324.948 591.08 318.89 587.099C306.774 579.138 289.804 567.732 270.389 553.955C231.556 526.398 182.954 489.365 143.848 451.441C65.6181 375.577 5.16663 283.299 5.16663 182.7C5.16663 82.1603 84.0917 0.5 181.467 0.5C249.397 0.5 308.066 40.2805 337.554 98.3265Z" />
              </g>
            </svg>
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
