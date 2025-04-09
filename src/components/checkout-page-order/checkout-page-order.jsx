import PulseLoader from 'react-spinners/PulseLoader';

import CheckoutPageOrderedItems from '../checkout-page-ordered-items/checkout-page-ordered-items';
import CheckoutPageCounting from '../checkout-page-counting/checkout-page-counting';

import './checkout-page-order.sass';

const CheckoutPageOrder = ({
  loading,
  orderedItems,
  countedBasket,
  promocode,
}) => {
  return (
    <div className="checkout-page_main_order">
      <div className="checkout-page_main_order_inner">
        {loading ? (
          <div className="checkout-page_main_order_inner_loader">
            <PulseLoader />
          </div>
        ) : (
          <CheckoutPageOrderedItems items={orderedItems} />
        )}
        <CheckoutPageCounting
          items={orderedItems}
          countedBasket={countedBasket}
          promocode={promocode}
        />
      </div>
    </div>
  );
};

export default CheckoutPageOrder;
