import { useEffect } from 'react';
import { getOrder } from '../../../api/orderAPI';
import { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import './order-page.sass';
import useWindowSize from '../../../hooks/use-window-size';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setNotificationModal } from '../../../store/action';
import ErrorIcon from '@mui/icons-material/Error';
import dayjs from 'dayjs';
import { getCurrencySymbol } from '../../../utils';
import ProgressiveImageContainer from '../../progressive-image-container/progressive-image-container';

const OrderPage = () => {
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [ww] = useWindowSize();
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
      <h1 className="order-page_title">
        Order №{order.id}{' '}
        <span className={`order-page_title_status ${order.status}`}>
          {order.status.toUpperCase()}
        </span>
      </h1>
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
          {ww <= 992 && (
            <div className="order-page_main_count">
              <div className="order-page_main_count_summary">
                <h2 className="order-page_main_count_summary_title">Summary</h2>
                <div className="order-page_main_count_summary_subtotal">
                  <h4>
                    Subtotal ({itemsCount} {itemsCount > 1 ? 'items' : 'item'})
                  </h4>
                  <p>
                    {getCurrencySymbol(order.originalCurrency)}
                    {order.subtotal}
                  </p>
                </div>
                <div className="order-page_main_count_summary_shipping">
                  <h4>Shipping cost</h4>
                  <p>
                    {order.shippingCost > 0
                      ? `${getCurrencySymbol(order.originalCurrency)}${
                          order.shippingCost
                        }`
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
                        - {getCurrencySymbol(order.originalCurrency)}
                        {order.promocodeDiscountTotal}
                      </p>
                    </div>
                  )}
                <div className="order-page_main_count_summary_total">
                  <h4>Total</h4>
                  <p>
                    {getCurrencySymbol(order.originalCurrency)}
                    {order.originalTotal}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="order-page_main_items">
            <div className="order-page_main_items_inner">
              <h2>Items</h2>
              {order.items?.map((item) => {
                return ww > 768 ? (
                  <div
                    key={item.id}
                    className="order-page_main_items_inner_item"
                  >
                    <div>
                      <div className="order-page_main_items_inner_item_visual">
                        <ProgressiveImageContainer
                          thumb={`https://ik.imagekit.io/motorolla29/exotic-beds/catalog/${item.photo}?tr=w-25`}
                          src={`https://ik.imagekit.io/motorolla29/exotic-beds/catalog/${item.photo}?tr=w-100`}
                          alt="order-item-image"
                        />
                      </div>
                      <p className="order-page_main_items_inner_item_title">
                        {item.title}
                      </p>
                    </div>
                    <div>
                      <p className="order-page_main_items_inner_item_price-each">
                        {getCurrencySymbol(order.originalCurrency)}
                        {(item.sale || item.price).toFixed(2)} each
                      </p>
                      <p className="order-page_main_items_inner_item_price-total">
                        {getCurrencySymbol(order.originalCurrency)}
                        {((item.sale || item.price) * item.quantity).toFixed(2)}
                      </p>

                      <p className="order-page_main_items_inner_item_count">
                        x {item.quantity} {item.quantity > 1 ? 'pcs' : 'pc '}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    key={item.id}
                    className="order-page_main_items_inner_item-sm"
                  >
                    <div className="order-page_main_items_inner_item-sm_visual">
                      <ProgressiveImageContainer
                        thumb={`https://ik.imagekit.io/motorolla29/exotic-beds/catalog/${item.photo}?tr=w-25`}
                        src={`https://ik.imagekit.io/motorolla29/exotic-beds/catalog/${item.photo}?tr=w-100`}
                        alt="order-item-image"
                      />
                    </div>
                    <div>
                      <p className="order-page_main_items_inner_item-sm_title">
                        {item.title}
                      </p>
                      <p className="order-page_main_items_inner_item-sm_price-each">
                        {getCurrencySymbol(order.originalCurrency)}
                        {(item.sale || item.price).toFixed(2)} each
                      </p>
                      <div>
                        <p className="order-page_main_items_inner_item-sm_price-total">
                          {getCurrencySymbol(order.originalCurrency)}
                          {((item.sale || item.price) * item.quantity).toFixed(
                            2
                          )}
                        </p>
                        <p className="order-page_main_items_inner_item-sm_count">
                          x {item.quantity} {item.quantity > 1 ? 'pcs' : 'pc '}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {ww > 992 && (
          <div className="order-page_main_count">
            <div className="order-page_main_count_summary">
              <h2 className="order-page_main_count_summary_title">Summary</h2>
              <div className="order-page_main_count_summary_subtotal">
                <h4>
                  Subtotal ({itemsCount} {itemsCount > 1 ? 'items' : 'item'})
                </h4>
                <p>
                  {getCurrencySymbol(order.originalCurrency)}
                  {order.subtotal}
                </p>
              </div>
              <div className="order-page_main_count_summary_shipping">
                <h4>Shipping cost</h4>
                <p>
                  {order.shippingCost > 0
                    ? `${getCurrencySymbol(order.originalCurrency)}${
                        order.shippingCost
                      }`
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
                      - {getCurrencySymbol(order.originalCurrency)}
                      {order.promocodeDiscountTotal}
                    </p>
                  </div>
                )}
              <div className="order-page_main_count_summary_total">
                <h4>Total</h4>
                <p>
                  {getCurrencySymbol(order.originalCurrency)}
                  {order.originalTotal}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
