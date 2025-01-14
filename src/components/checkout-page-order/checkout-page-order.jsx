import { useSelector } from 'react-redux';
import './checkout-page-order.sass';
import ProgressiveImageContainer from '../progressive-image-container/progressive-image-container';
import { useState } from 'react';
import { PROMOCODES } from '../../data/promocodes';
import { animate } from 'framer-motion';
import { countTheBasket } from '../../utils';

const CheckoutPageOrder = () => {
  const orderedItems = useSelector((state) => state.cartProducts);
  const countedBasket = countTheBasket(orderedItems);

  const [promocodeInput, setPromocodeInput] = useState('');
  const [promocodeStatus, setPromocodeStatus] = useState(null);
  const [promocode, setPromocode] = useState(null);
  const onApplyPromocodeClick = () => {
    if (Object.keys(PROMOCODES).includes(promocodeInput.toLowerCase())) {
      setPromocode(promocodeInput.toLowerCase());
      setPromocodeStatus('valid');
    } else {
      setPromocodeStatus('invalid');
      animate(
        '.checkout-page_main_order_inner_promocode_body_status',
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

  return (
    <div className="checkout-page_main_order">
      <div className="checkout-page_main_order_inner">
        <div className="checkout-page_main_order_inner_items">
          {orderedItems.map((it) => {
            return (
              <div
                key={it.id}
                className="checkout-page_main_order_inner_items_item"
              >
                <div className="checkout-page_main_order_inner_items_item_info">
                  <div className="checkout-page_main_order_inner_items_item_info_visual">
                    <div>
                      <ProgressiveImageContainer
                        thumb={`https://ik.imagekit.io/motorolla29/exotic-beds/catalog/${it.photo}?tr=w-20`}
                        src={`https://ik.imagekit.io/motorolla29/exotic-beds/catalog/${it.photo}?tr=w-150`}
                        alt="order-item-image"
                      />
                    </div>
                    {it.quantity > 1 && (
                      <span className="checkout-page_main_order_inner_items_item_info_visual_count">
                        {it.quantity}
                      </span>
                    )}
                  </div>
                  <span className="checkout-page_main_order_inner_items_item_info_title">
                    {it.title}
                  </span>
                </div>
                <span className="checkout-page_main_order_inner_items_item_price">
                  €{it.price.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="checkout-page_main_order_inner_promocode">
          <div className="checkout-page_main_order_inner_promocode_body">
            <div className="checkout-page_main_order_inner_promocode_body_input-container">
              <input
                placeholder="Discount code or gift card"
                value={promocode ? promocode : promocodeInput}
                disabled={promocode}
                onChange={(e) => {
                  setPromocodeStatus(null);
                  setPromocodeInput(e.target.value);
                }}
                className={`checkout-page_main_order_inner_promocode_body_input ${promocodeStatus}`}
              />
              <span
                style={{
                  visibility: promocodeStatus ? 'visible' : 'hidden',
                }}
                className={`checkout-page_main_order_inner_promocode_body_status ${promocodeStatus}`}
              >
                {promocodeStatus === 'valid'
                  ? 'Promocode applied'
                  : 'Invalid promocode'}
              </span>
            </div>
            {promocode ? (
              <button
                onClick={onCancelPromocodeClick}
                className="checkout-page_main_order_inner_promocode_body_button"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={onApplyPromocodeClick}
                className="checkout-page_main_order_inner_promocode_body_button"
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
        <div className="checkout-page_main_order_inner_count">
          <div className="checkout-page_main_order_inner_count_subtotal">
            <span>
              Subtotal •{' '}
              {orderedItems.reduce(
                (acc, currentValue) => acc + currentValue.quantity,
                0
              )}{' '}
              items
            </span>
            <span>€{countedBasket.subtotal - countedBasket.savings}</span>
          </div>
          {promocode && (
            <div className="checkout-page_main_order_inner_count_promocode">
              <span>
                Promocode ({' '}
                <span
                  style={{
                    color: '#004757',
                    textDecoration: 'underline green wavy',
                  }}
                >
                  {promocode}
                </span>{' '}
                )
              </span>
              <span>
                - €{(countedBasket.total * PROMOCODES[promocode]).toFixed(2)}
              </span>
            </div>
          )}
          <div className="checkout-page_main_order_inner_count_delivery">
            <span>Shipping</span>
            <span>
              {typeof countedBasket.delivery === 'number' ? '€' : ''}
              {countedBasket.delivery}
            </span>
          </div>
          <div className="checkout-page_main_order_inner_count_total">
            <span>Total</span>
            <span>
              €
              {(
                countedBasket.total -
                (promocode ? countedBasket.total * PROMOCODES[promocode] : 0)
              ).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPageOrder;
