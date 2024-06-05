import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { motion, AnimatePresence } from 'framer-motion';

import { cartOpen } from '../../store/action';
import CartEmpty from '../cart-empty/cart-empty';
import CartItem from '../cart-item/cart-item';
import { countTheBasket } from '../../utils';
import { scrollController } from '../../utils';

import './cart.sass';

const Cart = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.isCartOpen);
  const cartItems = useSelector((state) => state.cartProducts);
  const cartItemsTotal = cartItems.reduce(
    (acc, currentValue) => acc + currentValue.quantityInCart,
    0
  );

  useEffect(() => {
    if (isOpen) {
      scrollController.disabledScroll();
    } else {
      scrollController.enabledScroll();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="cart">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => dispatch(cartOpen(false))}
            className="cart_shadow"
          />
          <motion.div
            key="cart"
            initial={{ opacity: 0, x: 150 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 150 }}
            transition={{ duration: 0.5 }}
            className="cart_widget"
          >
            <div className="cart_widget_widget-inner">
              <OverlayScrollbarsComponent
                className="cart_widget_widget-inner_scroll-container"
                defer
              >
                <div className="cart_widget_widget-inner_header">
                  <div className="cart_widget_widget-inner_header_title">
                    <h1>
                      {cartItemsTotal
                        ? 'Shopping Basket'
                        : 'Shopping Basket is empty'}
                    </h1>
                    {cartItemsTotal ? (
                      <p>
                        You have {cartItemsTotal}{' '}
                        {cartItemsTotal === 1 ? 'item' : 'items'} in your basket
                      </p>
                    ) : null}
                  </div>
                  <div
                    onClick={() => dispatch(cartOpen(false))}
                    className="cart_widget_widget-inner_header_close"
                  />
                </div>
                {cartItemsTotal ? (
                  <div className="cart_widget_widget-inner_scroll-inner">
                    {cartItems.map((item) => {
                      return <CartItem key={item.id} item={item} />;
                    })}
                    <div className="cart_widget_widget-inner_summary">
                      <div className="cart_widget_widget-inner_summary_title">
                        Summary
                      </div>
                      <div className="cart_widget_widget-inner_summary_total">
                        <span>Items:</span>
                        <span>€{countTheBasket(cartItems).items}</span>
                      </div>
                      <div className="cart_widget_widget-inner_summary_total">
                        <span>Subtotal:</span>
                        <span>€{countTheBasket(cartItems).subtotal}</span>
                      </div>
                      <div className="cart_widget_widget-inner_summary_total">
                        <span>Delivery:</span>
                        <span>
                          {typeof countTheBasket(cartItems).delivery ===
                          'number'
                            ? '€'
                            : ''}
                          {countTheBasket(cartItems).delivery}
                        </span>
                      </div>
                      <div className="cart_widget_widget-inner_summary_total">
                        <span>Total savings:</span>
                        <span>€{countTheBasket(cartItems).savings}</span>
                      </div>
                      <div className="cart_widget_widget-inner_summary_order-total">
                        <span>Order total:</span>
                        <span>€{countTheBasket(cartItems).total}</span>
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
                ) : (
                  <div className="cart_widget_widget-inner_scroll-inner-empty">
                    <CartEmpty />
                  </div>
                )}
              </OverlayScrollbarsComponent>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Cart;
