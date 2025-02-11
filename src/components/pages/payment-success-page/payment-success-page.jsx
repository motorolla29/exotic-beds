import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { ReactComponent as SuccessIcon } from '../../../images/success.svg';
import { BiError } from 'react-icons/bi';
import { BiErrorCircle } from 'react-icons/bi';

import './payment-success-page.sass';
import { setCart } from '../../../store/action';

const PaymentSuccessPage = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.isAuth);
  const user = useSelector((state) => state.user);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pollingAttempts, setPollingAttempts] = useState(0);

  //примерно 30 секунд при интервале 3 секунды
  const maxPollingAttempts = 10;

  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      setError('Order ID not found in URL');
      setLoading(false);
      return;
    }

    const intervalId = setInterval(() => {
      fetch(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Заголовок авторизации:
          // 'Authorization': `Bearer ${yourAuthToken}`
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error receiving order data');
          }
          return response.json();
        })
        .then((data) => {
          setOrder(data);
          setPollingAttempts((prev) => prev + 1);
          // Если получен окончательный статус — прекращаем опрос
          if (data.status === 'paid' || data.status === 'failed') {
            if (data.status === 'paid') {
              isAuth ? dispatch(setCart([])) : localStorage.removeItem('cart');
            }
            clearInterval(intervalId);
            setLoading(false);
          } else if (pollingAttempts >= maxPollingAttempts) {
            // Если превышен лимит ожидания, прекращаем опрос и сообщаем об ошибке или предлагаем обновить страницу
            clearInterval(intervalId);
            setLoading(false);
            setError(
              `Failed to get payment status update. Try refreshing the page or contact support.`
            );
          }
        })
        .catch((err) => {
          console.error('Error when polling an order:', err);
          clearInterval(intervalId);
          setError('Error checking order status');
          setLoading(false);
        });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [orderId, pollingAttempts]);

  if (loading) {
    return (
      <div className="payment-success-page">
        <h2>Checking the payment status, please wait...</h2>
        <PropagateLoader
          className="propagate-loader"
          size="1.5em"
          color="#004757"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-success-page">
        <div className="payment-success-page_error-div">
          <BiError />
          <p className="payment-success-page_error-div_error-message">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (order) {
    if (order.status === 'paid') {
      return (
        <div className="payment-success-page">
          <div className="payment-success-page_icon">
            <SuccessIcon />
          </div>
          <h2 className="payment-success-page_success-title">
            Payment successfully completed!
          </h2>
          <p className="payment-success-page_success-description">
            Thank you for ordering in our online store! Detailed information
            about the order and delivery has been sent to {order?.email}
          </p>
          <p className="payment-success-page_success-order">
            Order № {order.id}
          </p>
          <p className="payment-success-page_success-total">
            Total: {order.total} {order.currency}
          </p>
          {/* Здесь можно вывести дополнительные детали заказа */}
          <div className="payment-success-page_links">
            {isAuth && user && (
              <Link
                className="payment-success-page_links_orders-link"
                to="/account"
              >
                My Orders
              </Link>
            )}
            <Link className="payment-success-page_links_home-link" to="/">
              Home Page
            </Link>
          </div>
        </div>
      );
    } else if (order.status === 'failed') {
      return (
        <div className="payment-success-page">
          <div className="payment-success-page_payment-failed">
            <BiErrorCircle />
            <h3 className="payment-success-page_payment-failed_title">
              Payment failed
            </h3>
            <p className="payment-success-page_payment-failed_description">
              Please try again or contact support.
            </p>
          </div>
        </div>
      );
    }
  }

  return null;
};

export default PaymentSuccessPage;
