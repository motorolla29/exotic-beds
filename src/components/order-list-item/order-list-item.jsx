import dayjs from 'dayjs';
import './order-list-item.sass';
import { Link } from 'react-router-dom';

const OrderListItem = ({ order }) => {
  const orderItems = JSON.parse(order.items);
  return (
    <div className="order-list-item">
      <div key={order.id} className="order-list-item_first-top">
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
          {orderItems.length} {orderItems.length > 1 ? 'items' : 'item'}
        </p>
      </div>
      <div className="order-list-item_visual"></div>
      <Link to="/" className="order-list-item_link">
        Details
      </Link>
    </div>
  );
};

export default OrderListItem;
