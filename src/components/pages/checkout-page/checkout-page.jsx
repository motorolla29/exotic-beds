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

const CheckoutPage = () => {
  const [ww] = useWindowSize();
  const [topOrderSummaryVisible, setTopOrderSummaryVisible] = useState(false);

  const orderedItems = useSelector((state) => state.cartProducts);
  const countedBasket = countTheBasket(orderedItems);
  const [promocode, setPromocode] = useState(null);

  return (
    <div className="checkout-page">
      <div className="checkout-page_header">
        <Link className="checkout-page_header_logo" to="/">
          <img
            alt="logo"
            src="https://ik.imagekit.io/motorolla29/exotic-beds/logo/EB-LOGO-HD.png"
          />
        </Link>
      </div>
      <div className="checkout-page_main">
        {ww <= 998 && (
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
                  €
                  {(
                    countedBasket.total -
                    (promocode
                      ? countedBasket.total * PROMOCODES[promocode]
                      : 0)
                  ).toFixed(2)}
                </p>
              </div>
            </div>
            {topOrderSummaryVisible && <CheckoutPageOrder />}
          </div>
        )}
        <CheckoutPageInfo />
        {ww > 998 && <CheckoutPageOrder />}
      </div>
    </div>
  );
};

export default CheckoutPage;
