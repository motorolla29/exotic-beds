import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import dayjs from 'dayjs';

import { IoIosArrowBack } from 'react-icons/io';
import useWindowSize from '../../../hooks/use-window-size';
import ErrorIcon from '@mui/icons-material/Error';

import { getOrder } from '../../../api/orderAPI';
import { setNotificationModal } from '../../../store/action';
import { getCurrencySymbol } from '../../../utils';
import ProgressiveImageContainer from '../../progressive-image-container/progressive-image-container';

import './order-page.sass';

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
    0,
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
        }),
      );
      navigate('/account/orders');
    }
  }, [error, navigate, dispatch, id]);

  if (loading) {
    return (
      <div className="order-page">
        <p className="order-page_loading">Loading order...</p>
      </div>
    );
  }

  return (
    <div className="order-page">
      <Helmet>
        <title>Shop Order</title>
      </Helmet>
      <Link className="order-page_back-link" to="/account/orders">
        <IoIosArrowBack />
        <span>Back</span>
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
                      <Link
                        className="order-page_main_items_inner_item_link"
                        to={`/${item.productId}`}
                      >
                        <div className="order-page_main_items_inner_item_visual">
                          <ProgressiveImageContainer
                            thumb={`https://exotic-beds.s3.cloud.ru/catalog/xs__${item.photo}`}
                            src={`https://exotic-beds.s3.cloud.ru/catalog/sm__${item.photo}`}
                            defaultThumbSrc="https://exotic-beds.s3.cloud.ru/catalog/xs__EB-LOGO-SHAPE-DEFAULT_IMG.png"
                            defaultSrc="https://exotic-beds.s3.cloud.ru/catalog/sm__EB-LOGO-SHAPE-DEFAULT_IMG.png"
                            alt="order-item-image"
                          />
                        </div>
                      </Link>

                      <Link
                        className="order-page_main_items_inner_item_link"
                        to={`/${item.productId}`}
                      >
                        <p className="order-page_main_items_inner_item_title">
                          {item.title}
                        </p>
                      </Link>
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
                    <Link
                      className="order-page_main_items_inner_item-sm_link"
                      to={`/${item.productId}`}
                    >
                      <div className="order-page_main_items_inner_item-sm_visual">
                        <ProgressiveImageContainer
                          thumb={`https://exotic-beds.s3.cloud.ru/catalog/xs__${item.photo}`}
                          src={`https://exotic-beds.s3.cloud.ru/catalog/sm__${item.photo}`}
                          defaultThumbSrc="https://exotic-beds.s3.cloud.ru/catalog/xs__EB-LOGO-SHAPE-DEFAULT_IMG.png"
                          defaultSrc="https://exotic-beds.s3.cloud.ru/catalog/sm__EB-LOGO-SHAPE-DEFAULT_IMG.png"
                          alt="order-item-image"
                        />
                      </div>
                    </Link>
                    <div>
                      <Link
                        className="order-page_main_items_inner_item-sm_link"
                        to={`/${item.productId}`}
                      >
                        <p className="order-page_main_items_inner_item-sm_title">
                          {item.title}
                        </p>
                      </Link>
                      <p className="order-page_main_items_inner_item-sm_price-each">
                        {getCurrencySymbol(order.originalCurrency)}
                        {(item.sale || item.price).toFixed(2)} each
                      </p>
                      <div className="order-page_main_items_inner_item-sm_total-with-count-container">
                        <p className="order-page_main_items_inner_item-sm_price-total">
                          {getCurrencySymbol(order.originalCurrency)}
                          {((item.sale || item.price) * item.quantity).toFixed(
                            2,
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
