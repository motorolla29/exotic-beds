import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsCartOpen } from '../../store/action';
import CartItem from '../cart-item/cart-item';

import './cart.sass';

const Cart = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.isCartOpen);
  const cartItems = useSelector((state) => state.cartProducts);
  const cartSummary = useSelector((state) => state.cartSummary);
  const cartItemsTotal = cartItems.reduce(
    (acc, currentValue) => acc + currentValue.quantityInCart,
    0
  );

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [dispatch, isOpen]);

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
                <p>
                  You have {cartItemsTotal}{' '}
                  {cartItemsTotal === 1 ? 'item' : 'items'} in your basket
                </p>
              </div>
              <div
                onClick={() => dispatch(setIsCartOpen(false))}
                className="cart_widget_widget-inner_header_close"
              />
            </div>
            {cartItems.map((item) => {
              return <CartItem key={item.id} item={item} />;
            })}
            <div className="cart_widget_widget-inner_summary">
              <div className="cart_widget_widget-inner_summary_title">
                Summary
              </div>
              <div className="cart_widget_widget-inner_summary_total">
                <span>Items:</span>
                <span>{cartSummary.items}</span>
              </div>
              <div className="cart_widget_widget-inner_summary_total">
                <span>Subtotal:</span>
                <span>{cartSummary.subtotal}</span>
              </div>
              <div className="cart_widget_widget-inner_summary_total">
                <span>Delivery:</span>
                <span>{cartSummary.delivery}</span>
              </div>
              <div className="cart_widget_widget-inner_summary_total">
                <span>Total savings:</span>
                <span>{cartSummary.savings}</span>
              </div>
              <div className="cart_widget_widget-inner_summary_order-total">
                <span>Order total:</span>
                <span>{cartSummary.total}</span>
              </div>
            </div>
            <div className="cart_widget_widget-inner_promocode">
              <span className="cart_widget_widget-inner_promocode_title">
                If you have a promo code enter it here:
              </span>
              <div className="cart_widget_widget-inner_promocode_body">
                <input className="cart_widget_widget-inner_promocode_body_input"></input>
                <button className="cart_widget_widget-inner_promocode_body_button">
                  Apply
                </button>
              </div>
            </div>
            <div className="cart_widget_widget-inner_checkout">
              <button className="cart_widget_widget-inner_checkout_button">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Cart;
