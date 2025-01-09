import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TextField } from '@mui/material';

import './checkout-page.sass';
import { Link } from 'react-router-dom';
import CheckoutPageInfo from '../../checkout-page-info/checkout-page-info';
import CheckoutPageOrder from '../../checkout-page-order/checkout-page-order';

const CheckoutPage = () => {
  const cartProducts = useSelector((state) => state.cartProducts);
  const [paymentMethod, setPaymentMethod] = useState(null);

  //   useEffect(() => {}, []);

  //   const onSubmit = (data) => {
  //     console.log(data);
  //   };

  //   const handleCountryChange = (selected) => {
  //   };

  //   const handleCityChange = (selected) => {
  //   };

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
        <CheckoutPageInfo />
        <CheckoutPageOrder />
      </div>
    </div>
  );
};

export default CheckoutPage;
