import { useDispatch, useSelector } from 'react-redux';
import { setIsCartOpen } from '../../store/action';

import './cart.sass';

const Cart = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.isCartOpen);
  const cartItems = useSelector((state) => state.cartProducts);

  return (
    isOpen && (
      <div className="cart">
        <div
          onClick={() => dispatch(setIsCartOpen(false))}
          className="cart_shadow"
        />
        <div className="cart_widget">
          <div className="cart_widget_widget-inner">
            <div className="cart_widget_widget-inner_header">
              <div className="cart_widget_widget-inner_header_title">
                <h1>Shopping Basket</h1>
                <p>You have 4 items in your basket</p>
              </div>
              <div
                onClick={() => dispatch(setIsCartOpen(false))}
                className="cart_widget_widget-inner_header_close"
              />
            </div>
            {cartItems.map((item) => (
              <div className="cart-item">
                <div className="cart-item_photo">
                  <img alt="img" src={item.photo} />
                </div>
                <div className="cart-item_body">
                  <div className="cart-item_body_info">
                    <div className="cart-item_body_info_title">blala</div>
                    <div className="cart-item_body_info_price">
                      <span className="cart-item_body_info_price_last">50</span>
                      <span className="cart-item_body_info_price_first">
                        100
                      </span>
                    </div>
                  </div>
                  <div className="cart-item_body_ui">
                    <div className="cart-item_body_ui_lovelist">♥</div>
                    <div className="cart-item_body_ui_right-side">
                      <span className="cart-item_body_ui_right-side_remove">
                        Remove
                      </span>
                      <div className="cart-item_body_ui_right-side_counter">
                        <span className="cart-item_body_ui_right-side_counter_minus">
                          -
                        </span>
                        <input className="cart-item_body_ui_right-side_counter_input" />
                        <span className="cart-item_body_ui_right-side_counter_plus">
                          +
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Cart;
