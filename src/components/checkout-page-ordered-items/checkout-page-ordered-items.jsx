import ProgressiveImageContainer from '../progressive-image-container/progressive-image-container';

import './checkout-page-ordered-items.sass';

const CheckoutPageOrderedItems = ({ items }) => {
  return (
    <div className="checkout-page-ordered-items">
      {items.map((it) => {
        return (
          <div key={it.id} className="checkout-page-ordered-items_item">
            <div className="checkout-page-ordered-items_item_info">
              <div className="checkout-page-ordered-items_item_info_visual">
                <div>
                  <ProgressiveImageContainer
                    thumb={`https://exotic-beds.s3.cloud.ru/catalog/xs__${it.photo}`}
                    src={`https://exotic-beds.s3.cloud.ru/catalog/sm__${it.photo}`}
                    alt="order-item-image"
                  />
                </div>
                {it.quantity > 1 && (
                  <span className="checkout-page-ordered-items_item_info_visual_count">
                    {it.quantity}
                  </span>
                )}
              </div>
              <p className="checkout-page-ordered-items_item_info_title">
                {it.title}
              </p>
            </div>
            <span className="checkout-page-ordered-items_item_price">
              €{it.sale?.toFixed(2) || it.price.toFixed(2)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutPageOrderedItems;
