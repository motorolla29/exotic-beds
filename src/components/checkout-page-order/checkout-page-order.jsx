import CheckoutPageOrderedItems from '../checkout-page-ordered-items/checkout-page-ordered-items';
import CheckoutPageCounting from '../checkout-page-counting/checkout-page-counting';

import './checkout-page-order.sass';

const CheckoutPageOrder = ({ orderedItems, countedBasket }) => {
  return (
    <div className="checkout-page_main_order">
      <div className="checkout-page_main_order_inner">
        <CheckoutPageOrderedItems items={orderedItems} />
        <CheckoutPageCounting
          items={orderedItems}
          countedBasket={countedBasket}
        />
      </div>
    </div>
  );
};

export default CheckoutPageOrder;
