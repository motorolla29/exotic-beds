import { useEffect } from 'react';
import { getOrders } from '../../../api/orderAPI';
import { useState } from 'react';
import { Helmet } from 'react-helmet';

import { BiError } from 'react-icons/bi';
import OrderListItem from '../../order-list-item/order-list-item';

import './orders-page.sass';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOrders()
      .then((data) => {
        setOrders(data.filter((order) => order.status === 'paid'));
      })
      .catch(() => setError('Error loading orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="orders-page">
        <Helmet>
          <title>My Orders</title>
        </Helmet>
        <p className="orders-page_loading">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <Helmet>
          <title>My Orders</title>
        </Helmet>
        <div className="orders-page_error">
          <p>
            <BiError />
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (orders.length === 0)
    return (
      <div className="orders-page">
        <Helmet>
          <title>My Orders</title>
        </Helmet>
        <p className="orders-page_nothing">
          You haven't made any orders yet...
        </p>
      </div>
    );

  return (
    <div className="orders-page">
      <Helmet>
        <title>My Orders</title>
      </Helmet>
      <div className="orders-page_orders-list">
        {orders.map((order) => (
          <OrderListItem key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
