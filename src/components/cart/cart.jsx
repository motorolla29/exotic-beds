/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { motion, AnimatePresence, useAnimate } from 'framer-motion';

import { cartOpen } from '../../store/action';
import CartEmpty from '../cart-empty/cart-empty';
import CartItem from '../cart-item/cart-item';
import { countTheBasket } from '../../utils';
import { scrollController } from '../../utils';
import { PROMOCODES } from '../../data/promocodes';

import './cart.sass';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const overlayLoading = useSelector((state) => state.overlayLoader);
  const isOpen = useSelector((state) => state.isCartOpen);
  const cartItems = useSelector((state) => state.cartProducts);
  const cartItemsTotal = cartItems.reduce(
    (acc, currentValue) => acc + currentValue.quantity,
    0
  );
  const [promocodeInput, setPromocodeInput] = useState('');
  const [promocodeStatus, setPromocodeStatus] = useState(null);
  const [promocode, setPromocode] = useState(null);
  const [scope, animate] = useAnimate();

  const onApplyPromocodeClick = () => {
    if (Object.keys(PROMOCODES).includes(promocodeInput.toLowerCase())) {
      setPromocode(promocodeInput.toLowerCase());
      setPromocodeStatus('valid');
    } else {
      setPromocodeStatus('invalid');
      animate(
        '.cart_widget_widget-inner_promocode_body_status',
        {
          marginLeft: [0, -8, 0, 6, 0, -4, 0, 2, 0],
        },
        {
          transition: {
            duration: 0.9,
            ease: 'easeInOut',
            times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
          },
        }
      );
    }
  };
  const onCancelPromocodeClick = () => {
    setPromocode(null);
    setPromocodeStatus(null);
    setPromocodeInput('');
  };

  useEffect(() => {
    if (!overlayLoading) {
      if (isOpen) {
        scrollController.disabledScroll();
      } else {
        scrollController.enabledScroll();
      }
    }
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="cart" ref={scope}>
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
              <div className="cart_widget_header">
                <div className="cart_widget_header_title">
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
                  className="cart_widget_header_close"
                />
              </div>
              <div className="cart_widget_widget-inner">
                <OverlayScrollbarsComponent
                  className="cart_widget_widget-inner_scroll-container"
                  defer
                >
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
                        {promocode ? (
                          <div className="cart_widget_widget-inner_summary_total">
                            <span>
                              Promocode ({' '}
                              <span
                                style={{
                                  color: '#004757',
                                  textDecoration: 'underline red wavy',
                                }}
                              >
                                {promocode}
                              </span>{' '}
                              )
                            </span>
                            <span>
                              - €
                              {(
                                countTheBasket(cartItems).total *
                                PROMOCODES[promocode]
                              ).toFixed(2)}
                            </span>
                          </div>
                        ) : null}
                        <div className="cart_widget_widget-inner_summary_total">
                          <span>Total savings:</span>
                          <span>
                            €
                            {(
                              countTheBasket(cartItems).savings +
                              (promocode
                                ? countTheBasket(cartItems).total *
                                  PROMOCODES[promocode]
                                : 0)
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="cart_widget_widget-inner_summary_order-total">
                          <span>Order total:</span>
                          <span>
                            €
                            {(
                              countTheBasket(cartItems).total -
                              (promocode
                                ? countTheBasket(cartItems).total *
                                  PROMOCODES[promocode]
                                : 0)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="cart_widget_widget-inner_promocode">
                        <span className="cart_widget_widget-inner_promocode_title">
                          If you have a promo code enter it here:
                        </span>
                        <div className="cart_widget_widget-inner_promocode_body">
                          <div className="cart_widget_widget-inner_promocode_body_input-container">
                            <input
                              value={promocode ? promocode : promocodeInput}
                              disabled={promocode}
                              onChange={(e) => {
                                setPromocodeStatus(null);
                                setPromocodeInput(e.target.value);
                              }}
                              className={`cart_widget_widget-inner_promocode_body_input ${promocodeStatus}`}
                            />

                            <span
                              style={{
                                visibility: promocodeStatus
                                  ? 'visible'
                                  : 'hidden',
                              }}
                              className={`cart_widget_widget-inner_promocode_body_status ${promocodeStatus}`}
                            >
                              {promocodeStatus === 'valid'
                                ? 'Promocode applied'
                                : 'Invalid promocode'}
                            </span>
                          </div>
                          {promocode ? (
                            <button
                              onClick={onCancelPromocodeClick}
                              className="cart_widget_widget-inner_promocode_body_button"
                            >
                              Cancel
                            </button>
                          ) : (
                            <button
                              onClick={onApplyPromocodeClick}
                              className="cart_widget_widget-inner_promocode_body_button"
                              onBlur={() => {
                                if (!promocodeInput) {
                                  setPromocodeStatus(null);
                                }
                              }}
                            >
                              Apply
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="cart_widget_widget-inner_checkout">
                        <button
                          onClick={() => navigate('/checkout')}
                          className="cart_widget_widget-inner_checkout_button"
                        >
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
    </>
  );
};

export default Cart;
