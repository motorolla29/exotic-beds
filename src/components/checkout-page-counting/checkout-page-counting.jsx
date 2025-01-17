import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { animate } from 'framer-motion';
import { PROMOCODES } from '../../data/promocodes';
import { setAppliedPromocode } from '../../store/action';

import './checkout-page-counting.sass';

const CheckoutPageCounting = ({ items, countedBasket, promocode }) => {
  const dispatch = useDispatch();
  const [promocodeInput, setPromocodeInput] = useState('');

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
        '.checkout-page-counting_promocode_body_status',
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
  return (
    <div className="checkout-page-counting">
      <div className={`checkout-page-counting_promocode ${promocode.status}`}>
        <div className="checkout-page-counting_promocode_body">
          <div className="checkout-page-counting_promocode_body_input-container">
            <input
              placeholder="Discount code or gift card"
              value={promocode.name ? promocode.name : promocodeInput}
              disabled={promocode.name}
              onChange={(e) => {
                dispatch(setAppliedPromocode({ name: null, status: null }));
                setPromocodeInput(e.target.value);
              }}
              className={`checkout-page-counting_promocode_body_input ${promocode.status}`}
            />
            <span
              style={{
                visibility: promocode.status ? 'visible' : 'hidden',
              }}
              className={`checkout-page-counting_promocode_body_status ${promocode.status}`}
            >
              {promocode.status === 'valid'
                ? 'Promocode applied'
                : 'Invalid promocode'}
            </span>
          </div>
          {promocode.name ? (
            <button
              onClick={onCancelPromocodeClick}
              className="checkout-page-counting_promocode_body_button"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={onApplyPromocodeClick}
              className="checkout-page-counting_promocode_body_button"
              onBlur={() => {
                if (!promocodeInput) {
                  dispatch(setAppliedPromocode({ name: null, status: null }));
                }
              }}
            >
              Apply
            </button>
          )}
        </div>
      </div>
      <div className="checkout-page-counting_count">
        <div className="checkout-page-counting_count_subtotal">
          <span>
            Subtotal •{' '}
            {items.reduce(
              (acc, currentValue) => acc + currentValue.quantity,
              0
            )}{' '}
            items
          </span>
          <span>
            €{(countedBasket.subtotal - countedBasket.savings).toFixed(2)}
          </span>
        </div>
        {promocode.name && (
          <div className="checkout-page-counting_count_promocode">
            <span>
              Promocode ({' '}
              <span
                style={{
                  color: '#004757',
                  textDecoration: 'underline green wavy',
                }}
              >
                {promocode.name}
              </span>{' '}
              )
            </span>
            <span>
              - €{(countedBasket.total * PROMOCODES[promocode.name]).toFixed(2)}
            </span>
          </div>
        )}
        <div className="checkout-page-counting_count_delivery">
          <span>Shipping</span>
          <span>
            {typeof countedBasket.delivery === 'number' ? '€' : ''}
            {typeof countedBasket.delivery === 'number'
              ? countedBasket.delivery.toFixed(2)
              : countedBasket.delivery}
          </span>
        </div>
        <div className="checkout-page-counting_count_total">
          <span>Total</span>
          <span>
            €
            {(
              countedBasket.total -
              (promocode.name
                ? countedBasket.total * PROMOCODES[promocode.name]
                : 0)
            ).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPageCounting;
