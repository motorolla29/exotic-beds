/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { motion, AnimatePresence, useAnimate } from 'framer-motion';

import { cartOpen, setAppliedPromocode } from '../../store/action';
import CartEmpty from '../cart-empty/cart-empty';
import CartItem from '../cart-item/cart-item';
import { countTheBasket } from '../../utils';
import { scrollController } from '../../utils';
import { PROMOCODES } from '../../data/promocodes';

import './cart.sass';

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
  const promocode = useSelector((state) => state.appliedPromocode);
  const [promocodeInput, setPromocodeInput] = useState('');
  const [scope, animate] = useAnimate();

  const onApplyPromocodeClick = () => {
    if (Object.keys(PROMOCODES).includes(promocodeInput.toLowerCase())) {
      dispatch(
        setAppliedPromocode({
          name: promocodeInput.toLowerCase(),
          status: 'valid',
        })
      );
    } else {
      dispatch(setAppliedPromocode({ name: null, status: 'invalid' }));
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
    dispatch(setAppliedPromocode({ name: null, status: null }));
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

  useEffect(() => {
    return () => {
      scrollController.enabledScroll();
      dispatch(cartOpen(false));
    };
  }, []);

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
                        return <CartItem key={item.productId} item={item} />;
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
                        {promocode.name ? (
                          <div className="cart_widget_widget-inner_summary_total">
                            <span>
                              Promocode ({' '}
                              <span
                                style={{
                                  color: '#004757',
                                  textDecoration: 'underline red wavy',
                                }}
                              >
                                {promocode.name}
                              </span>{' '}
                              )
                            </span>
                            <span>
                              - €
                              {(
                                countTheBasket(cartItems).total *
                                PROMOCODES[promocode.name]
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
                              (promocode.name
                                ? countTheBasket(cartItems).total *
                                  PROMOCODES[promocode.name]
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
                              (promocode.name
                                ? countTheBasket(cartItems).total *
                                  PROMOCODES[promocode.name]
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
                              value={
                                promocode.name ? promocode.name : promocodeInput
                              }
                              disabled={promocode.name}
                              onChange={(e) => {
                                dispatch(
                                  setAppliedPromocode({
                                    name: null,
                                    status: null,
                                  })
                                );
                                setPromocodeInput(e.target.value);
                              }}
                              className={`cart_widget_widget-inner_promocode_body_input ${promocode.status}`}
                            />

                            <span
                              style={{
                                visibility: promocode.status
                                  ? 'visible'
                                  : 'hidden',
                              }}
                              className={`cart_widget_widget-inner_promocode_body_status ${promocode.status}`}
                            >
                              {promocode.status === 'valid'
                                ? 'Promocode applied'
                                : 'Invalid promocode'}
                            </span>
                          </div>
                          {promocode.name ? (
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
                                  dispatch(
                                    setAppliedPromocode({
                                      name: null,
                                      status: null,
                                    })
                                  );
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
