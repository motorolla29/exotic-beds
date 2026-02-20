import dayjs from 'dayjs';
import './order-list-item.sass';
import { Link } from 'react-router-dom';
import useWindowSize from '../../hooks/use-window-size';
import { useEffect, useState } from 'react';
import ProgressiveImageContainer from '../progressive-image-container/progressive-image-container';

const getVisibleOrderItemsCount = (ww) => {
  if (ww > 768) {
    return 8;
  }
  if (ww > 480 && ww <= 768) {
    return 6;
  }
  if (ww > 480 && ww <= 768) {
    return 4;
  }
  return 4;
};

const OrderListItem = ({ order }) => {
  const [ww] = useWindowSize();
  const [orderItemsVisibleCount, setOrderItemsVisibleCount] = useState(0);
  const itemsTotal = order.items.reduce(
    (acc, currentValue) => acc + currentValue.quantity,
    0,
  );
  useEffect(() => {
    setOrderItemsVisibleCount(getVisibleOrderItemsCount(ww));
  }, [ww]);

  return (
    <div className="order-list-item">
      <div className="order-list-item_first-top">
        <div className="order-list-item_first-top_info">
          <p>
            Order № <span>{order.id}</span> from{' '}
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </p>
        </div>
        <div className={`order-list-item_first-top_status ${order.status}`}>
          {order.status.toUpperCase()}
        </div>
      </div>
      <div className="order-list-item_second-top">
        <p className="order-list-item_second-top_total">
          {order.total} {order.currency}
        </p>
        <span>•</span>
        <p>
          Estimated shipping:{' '}
          {dayjs(order.createdAt).add(10, 'day').format('DD.MM.YYYY')}
        </p>
        <span>•</span>
        <p>
          {itemsTotal} {itemsTotal > 1 ? 'items' : 'item'}
        </p>
      </div>
      <div className="order-list-item_visual">
        {order.items
          .slice(
            order.items.length === orderItemsVisibleCount
              ? -orderItemsVisibleCount
              : -orderItemsVisibleCount + 1,
          )
          .map((item) => (
            <div key={item.id} className="order-list-item_visual_icon">
              <div>
                <ProgressiveImageContainer
                  thumb={`https://exotic-beds.s3.cloud.ru/catalog/xs__${item.photo}`}
                  src={`https://exotic-beds.s3.cloud.ru/catalog/sm__${item.photo}`}
                  defaultThumbSrc="https://exotic-beds.s3.cloud.ru/catalog/xs__EB-LOGO-SHAPE-DEFAULT_IMG.png"
                  defaultSrc="https://exotic-beds.s3.cloud.ru/catalog/sm__EB-LOGO-SHAPE-DEFAULT_IMG.png"
                  alt="order-item-image"
                />
              </div>
              {item.quantity > 1 && (
                <span className="order-list-item_visual_icon_count">
                  {item.quantity}
                </span>
              )}
            </div>
          ))}
        {order.items.length > orderItemsVisibleCount && (
          <div className="order-list-item_visual_icon addition">
            +{order.items.length - orderItemsVisibleCount - 1}
          </div>
        )}
      </div>
      <Link to={`/account/orders/${order.id}`} className="order-list-item_link">
        Details
      </Link>
    </div>
  );
};

export default OrderListItem;
