import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CheckoutPageInfo from '../../checkout-page-info/checkout-page-info';
import CheckoutPageOrder from '../../checkout-page-order/checkout-page-order';
import useWindowSize from '../../../hooks/use-window-size';
import { PROMOCODES } from '../../../data/promocodes';
import { countTheBasket } from '../../../utils';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import './checkout-page.sass';
import { Helmet } from 'react-helmet-async';

const CheckoutPage = () => {
  const [ww] = useWindowSize();
  const [topOrderSummaryVisible, setTopOrderSummaryVisible] = useState(false);

  const loading = useSelector((state) => state.overlayLoader);
  const orderedItems = useSelector((state) =>
    state.cartProducts.filter((item) => item.availableQuantity > 0)
  );
  const countedBasket = countTheBasket(orderedItems);
  const promocode = useSelector((state) => state.appliedPromocode);

  return (
    <div className="checkout-page">
      <Helmet>
        <title>Checkout</title>
      </Helmet>
      <div className="checkout-page_header">
        <Link className="checkout-page_header_logo" to="/">
          <img
            alt="logo"
            src="https://ik.imagekit.io/motorolla29/exotic-beds/logo/EB-LOGO-HD.png"
          />
        </Link>
      </div>
      <div className="checkout-page_main">
        {ww <= 992 && (
          <div className="checkout-page_main_sm-top-order">
            <div
              onClick={() => setTopOrderSummaryVisible(!topOrderSummaryVisible)}
              className="checkout-page_main_sm-top-order_heading"
            >
              <div className="checkout-page_main_sm-top-order_heading_inner">
                <span className="checkout-page_main_sm-top-order_heading_inner_title">
                  Order summary
                  <span>
                    {topOrderSummaryVisible ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </span>
                </span>
                <p className="checkout-page_main_sm-top-order_heading_inner_total">
                  {loading
                    ? '€0.00'
                    : `€${(
                        countedBasket.total -
                        (promocode.name
                          ? countedBasket.total * PROMOCODES[promocode.name]
                          : 0)
                      ).toFixed(2)}`}
                </p>
              </div>
            </div>
            {topOrderSummaryVisible && !loading && (
              <CheckoutPageOrder
                orderedItems={orderedItems}
                countedBasket={countedBasket}
                promocode={promocode}
              />
            )}
          </div>
        )}
        <CheckoutPageInfo
          orderedItems={orderedItems}
          countedBasket={countedBasket}
          promocode={promocode}
        />
        {ww > 992 && (
          <CheckoutPageOrder
            loading={loading}
            orderedItems={orderedItems}
            countedBasket={countedBasket}
            promocode={promocode}
          />
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
