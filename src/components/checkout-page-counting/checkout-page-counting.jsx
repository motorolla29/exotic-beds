import { useState } from 'react';
import { animate } from 'framer-motion';
import { PROMOCODES } from '../../data/promocodes';
import { countTheBasket } from '../../utils';

import './checkout-page-counting.sass';

const CheckoutPageCounting = ({ items }) => {
  const countedBasket = countTheBasket(items);

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
    setPromocode(null);
    setPromocodeStatus(null);
    setPromocodeInput('');
  };
  return (
    <div className="checkout-page-counting">
      <div className="checkout-page-counting_promocode">
        <div className="checkout-page-counting_promocode_body">
          <div className="checkout-page-counting_promocode_body_input-container">
            <input
              placeholder="Discount code or gift card"
              value={promocode ? promocode : promocodeInput}
              disabled={promocode}
              onChange={(e) => {
                setPromocodeStatus(null);
                setPromocodeInput(e.target.value);
              }}
              className={`checkout-page-counting_promocode_body_input ${promocodeStatus}`}
            />
            <span
              style={{
                visibility: promocodeStatus ? 'visible' : 'hidden',
              }}
              className={`checkout-page-counting_promocode_body_status ${promocodeStatus}`}
            >
              {promocodeStatus === 'valid'
                ? 'Promocode applied'
                : 'Invalid promocode'}
            </span>
          </div>
          {promocode ? (
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
                  setPromocodeStatus(null);
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
          <span>€{countedBasket.subtotal - countedBasket.savings}</span>
        </div>
        {promocode && (
          <div className="checkout-page-counting_count_promocode">
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
        <div className="checkout-page-counting_count_delivery">
          <span>Shipping</span>
          <span>
            {typeof countedBasket.delivery === 'number' ? '€' : ''}
            {countedBasket.delivery}
          </span>
        </div>
        <div className="checkout-page-counting_count_total">
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
  );
};

export default CheckoutPageCounting;
