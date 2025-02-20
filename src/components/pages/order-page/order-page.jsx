import { useEffect } from 'react';
import { getOrder } from '../../../api/orderAPI';
import { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import './order-page.sass';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setNotificationModal } from '../../../store/action';
import ErrorIcon from '@mui/icons-material/Error';
import dayjs from 'dayjs';

const OrderPage = () => {
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const itemsCount = order.items?.reduce(
    (acc, currentValue) => acc + currentValue.quantity,
    0
  );

  useEffect(() => {
    getOrder(id)
      .then((data) => {
        setOrder(data);
      })
      .catch((error) => setError(error.response.message || error.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (error) {
      dispatch(
        setNotificationModal({
          open: true,
          icon: <ErrorIcon />,
          title: error,
          description: `Error loading order №${id}`,
        })
      );
      navigate('/account/orders');
    }
  }, [error, navigate, dispatch, id]);

  if (loading) {
    return (
      <div className="order-page">
        <p className="order-page_main_loading">Loading order...</p>
      </div>
    );
  }

  return (
    <div className="order-page">
      <Link className="order-page_back-link" to="/account/orders">
        <IoIosArrowBack />
        Back
      </Link>
      <h1 className="order-page_title">Order №{order.id}</h1>
      <p className="order-page_from">
        from {new Date(order.createdAt).toLocaleDateString()}
      </p>
      <div className="order-page_main">
        <div>
          <div className="order-page_main_info">
            <div className="order-page_main_info_shipping">
              <h2>Shipping</h2>
              <div className="order-page_main_info_shipping_address">
                <h4>Address</h4>
                <p>
                  {order.country}, {order.city}, {order.address}
                  {order.apartment ? ` apt. ${order.apartment}` : ''}
                </p>
              </div>
              <div className="order-page_main_info_shipping_estimated-delivery">
                <h4>Estimated Delivery Date</h4>
                <p>
                  {dayjs(order.createdAt).add(10, 'day').format('DD MMMM YYYY')}
                </p>
              </div>
            </div>
            <div className="order-page_main_info_recipient">
              <h2 className="order-page_main_info_recipient_title">
                Recipient
              </h2>
              <div className="order-page_main_info_recipient_name">
                <h4>Name</h4>
                <p>
                  {order.name} {order.surname || ''}
                </p>
              </div>
              <div className="order-page_main_info_recipient_email">
                <h4>Email</h4>
                <p>{order.email}</p>
              </div>
              {order.company ? (
                <div className="order-page_main_info_recipient_company">
                  <h4>Company</h4>
                  <p>{order.company}</p>
                </div>
              ) : (
                ''
              )}
              {order.phoneNumber ? (
                <div className="order-page_main_info_recipient_phone">
                  <h4>Phone number</h4>
                  <p>{order.phoneNumber}</p>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className="order-page_main_items">
            <div className="order-page_main_items_inner">
              <h2 className="order-page_main_items_inner_title">Items</h2>
              {order.items?.map((item) => (
                <div key={item.id} className="order-page_main_items_inner_item">
                  <p className="order-page_main_items_inner_item_title">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="order-page_main_count">
          <div className="order-page_main_count_summary">
            <h2 className="order-page_main_count_summary_title">Summary</h2>
            <div className="order-page_main_count_summary_subtotal">
              <h4>
                Subtotal ({itemsCount} {itemsCount > 1 ? 'items' : 'item'})
              </h4>
              <p>9380 {order.originalCurrency}</p>
            </div>
            <div className="order-page_main_count_summary_shipping">
              <h4>Shipping cost</h4>
              <p>
                {order.shippingCost > 0
                  ? `${order.shippingCost} ${order.originalCurrency}`
                  : 'FREE'}
              </p>
            </div>
            {order.promocode &&
              order.promocodeDiscountTotal &&
              order.promocodeDiscountPercent && (
                <div className="order-page_main_count_summary_promocode">
                  <h4>
                    Promocode "{order.promocode}" (-
                    {order.promocodeDiscountPercent}
                    %)
                  </h4>
                  <p>
                    -{order.promocodeDiscountTotal} {order.originalCurrency}
                  </p>
                </div>
              )}
            <div className="order-page_main_count_summary_total">
              <h4>Total</h4>
              <p>
                {order.originalTotal} {order.originalCurrency}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
