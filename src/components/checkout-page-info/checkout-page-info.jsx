/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from '../../utils';
import {
  Checkbox,
  TextField,
  Box,
  Grid,
  FormControlLabel,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import JoyFormControl from '@mui/joy/FormControl';
import JoyFormLabel from '@mui/joy/FormLabel';
import JoySelect from '@mui/joy/Select';
import JoyOption from '@mui/joy/Option';
import { ClickAwayListener } from '@mui/base';
import { PinDrop } from '@mui/icons-material';
import { AVAILABLE_SHIPPING_COUNTRIES } from '../../const';
import {
  validateAddress,
  validateCity,
  validateEmail,
  validateName,
  validatePhone,
  validatePostalCode,
} from './fields-validators';
import useWindowSize from '../../hooks/use-window-size';
import ErrorIcon from '@mui/icons-material/Error';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import BeatLoader from 'react-spinners/BeatLoader';
import CheckoutPageOrderedItems from '../checkout-page-ordered-items/checkout-page-ordered-items';
import CheckoutPageCounting from '../checkout-page-counting/checkout-page-counting';
import { createOrder } from '../../api/orderAPI';
import { setNotificationModal } from '../../store/action';

import './checkout-page-info.sass';
import { PROMOCODES } from '../../data/promocodes';

const CheckoutPageInfo = ({ orderedItems, countedBasket, promocode }) => {
  const [ww] = useWindowSize();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [payButtonClicked, setPayButtonClicked] = useState(false);
  const [payButtonLoading, setPayButtonLoading] = useState(false);
  const [orderBodyVisible, setOrderBodyVisible] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [cityError, setCityError] = useState(null);
  const [postalCodeError, setPostalCodeError] = useState(null);
  const [phoneNumberError, setPhoneNumberError] = useState(null);

  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    country: 'US',
    city: '',
    postalCode: '',
    address: '',
    apartment: '',
    company: '',
    name: '',
    surname: '',
    phoneNumber: '',
    email: '',
  });

  useEffect(() => {
    setDeliveryData({
      ...deliveryData,
      email: user.email || deliveryData.email,
      name: user.name || deliveryData.name,
      surname: user.surname || deliveryData.surname,
      phoneNumber: user.phone || deliveryData.phoneNumber || '+',
    });
  }, [user.email, user.name, user.surname, user.phone]);

  const fetchAddressSuggestions = async (addressQuery, countryCode) => {
    if (!addressQuery.trim()) return;

    setLoadingSuggestions(true);
    try {
      const response = await axios.get(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(
          addressQuery
        )}.json`,
        {
          params: {
            key: process.env.MAPTILER_API_KEY,
            limit: 5,
            language: 'en',
            country: countryCode || undefined,
          },
        }
      );

      const results = response.data.features || [];
      setAddressSuggestions(
        results.map((feature) => ({
          name: feature.place_name,
          city:
            feature.context?.find((c) => c.id.includes('municipality'))?.text ||
            feature.context?.find((c) => c.id.startsWith('subregion'))?.text ||
            feature.context?.find((c) => c.id.startsWith('county'))?.text ||
            '',
          postalCode:
            feature.context?.find((c) => c.id.startsWith('postal_code'))
              ?.text || '',
        }))
      );
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setAddressSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const debouncedFetchAddressSuggestions = useCallback(
    debounce((addressQuery) => {
      fetchAddressSuggestions(addressQuery, deliveryData.country);
    }, 1000),
    [deliveryData.country]
  );

  const handleEmailChange = (e) => {
    setEmailError(validateEmail(e.target.value));
    if (user.email) return;
    setDeliveryData({ ...deliveryData, email: e.target.value });
  };

  const handleCountryChange = (newCountry) => {
    setAddressSuggestions([]);
    setDeliveryData({
      ...deliveryData,
      country: newCountry,
      city: '',
      postalCode: '',
      address: '',
      apartment: '',
    });

    setPayButtonClicked(false);

    setAddressError(null);
    setCityError(null);
    setPostalCodeError(null);
  };

  const handleNameChange = (e) => {
    setNameError(validateName(e.target.value));
    setDeliveryData((prevData) => ({
      ...prevData,
      name: e.target.value,
    }));
  };
  const handleSurameChange = (e) => {
    setDeliveryData((prevData) => ({
      ...prevData,
      surname: e.target.value,
    }));
  };
  const handleCompanyChange = (e) => {
    setDeliveryData((prevData) => ({
      ...prevData,
      company: e.target.value,
    }));
  };

  const handleAddressChange = (value) => {
    setAddressError(validateAddress(value));
    setDeliveryData((prevData) => ({
      ...prevData,
      address: value,
    }));

    debouncedFetchAddressSuggestions(value);
  };
  const handleAddressSelect = (selectedFeature) => {
    setDeliveryData((prevData) => ({
      ...prevData,
      address: selectedFeature.name,
      city: selectedFeature.city,
      postalCode: selectedFeature.postalCode,
    }));

    setAddressError(validateAddress(selectedFeature.name));
    setCityError(validateCity(selectedFeature.city));
    setPostalCodeError(
      validatePostalCode(selectedFeature.postalCode, deliveryData.country)
    );

    setAddressSuggestions([]);
  };

  const handleApartmentChange = (e) => {
    setDeliveryData((prevData) => ({
      ...prevData,
      apartment: e.target.value,
    }));
  };
  const handleCityChange = (value) => {
    setCityError(validateCity(value));
    setDeliveryData((prevData) => ({
      ...prevData,
      city: value,
    }));
  };
  const handlePostalCodeChange = (value) => {
    setPostalCodeError(validatePostalCode(value, deliveryData.country));
    setDeliveryData((prevData) => ({
      ...prevData,
      postalCode: value,
    }));
  };

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    setPhoneNumberError(validatePhone(input.replace(/[^0-9]/g, '')));

    if (!input.startsWith('+')) {
      setDeliveryData((prevData) => ({
        ...prevData,
        phoneNumber: '+' + input.replace(/[^0-9]/g, ''), // Убираем все, кроме цифр
      }));
    } else {
      setDeliveryData((prevData) => ({
        ...prevData,
        phoneNumber: input.replace(/[^0-9+]/g, ''), // Убираем все, кроме цифр и "+"
      }));
    }
  };

  const handlePayButtonClick = async () => {
    setPayButtonClicked(true);

    const emailError = validateEmail(deliveryData.email);
    const nameError = validateName(deliveryData.name);
    const addressError = validateAddress(deliveryData.address);
    const cityError = validateCity(deliveryData.city);
    const postalCodeError = validatePostalCode(
      deliveryData.postalCode,
      deliveryData.country
    );
    const phoneNumberError = validatePhone(
      deliveryData.phoneNumber.replace(/\D/g, '')
    );

    setEmailError(emailError);
    setNameError(nameError);
    setAddressError(addressError);
    setCityError(cityError);
    setPostalCodeError(postalCodeError);
    setPhoneNumberError(phoneNumberError);

    if (
      !emailError &&
      !nameError &&
      !addressError &&
      !cityError &&
      !postalCodeError &&
      !phoneNumberError
    ) {
      setPayButtonLoading(true);
      const orderData = {
        deliveryData,
        items: JSON.stringify(orderedItems),
        total: countedBasket.total,
        currency: 'EUR',
        promocode: promocode.name || null,
        promocodeDiscountTotal: PROMOCODES[promocode.name]
          ? +(countedBasket.total * PROMOCODES[promocode.name]).toFixed(2)
          : null,
        promocodeDiscountPercent: PROMOCODES[promocode.name] * 100 || null,
        shippingCost:
          countedBasket.delivery === 'FREE' ? 0 : countedBasket.delivery,
        paymentProviderName: 'YooKassa',
        description: user.id
          ? `Payment for the order for the user ID ${user.id}`
          : `Payment for the order for an unregistered user`,
        returnUrl: `${window.location.origin}/payment-success`,
      };

      try {
        const order = await createOrder(orderData);
        // Если сервер вернул confirmationUrl, перенаправляем пользователя
        if (order?.confirmationUrl) {
          window.location.href = order.confirmationUrl;
        } else {
          console.error('Payment URL not returned', order);
          // Обработайте ошибку – уведомите пользователя, например
          alert('Error initializing payment, please try again later');
        }
      } catch (error) {
        setPayButtonLoading(false);
        console.error('Error creating order:', error);
        dispatch(
          setNotificationModal({
            open: true,
            icon: <ErrorIcon />,
            title: error.response.data.message || error.message,
            description: 'Error creating order, please try again later',
          })
        );
      }
    }
  };

  return (
    <div className="checkout-page_main_info">
      <div className="checkout-page_main_info_inner">
        <div className="checkout-page_main_info_inner_contact">
          <p className="checkout-page_main_info_inner_contact_title">Contact</p>
          <TextField
            value={deliveryData.email}
            onChange={handleEmailChange}
            error={emailError && payButtonClicked}
            helperText={
              payButtonClicked && emailError
                ? emailError || 'Invalid email address'
                : ''
            }
            label="Email"
            variant="outlined"
          />
          <div className="checkout-page_main_info_inner_contact_mailing-consent">
            <FormControlLabel
              control={<Checkbox />}
              label="Email me with news and offers"
              labelPlacement="end"
            />
          </div>
        </div>
        <div className="checkout-page_main_info_inner_delivery">
          <p className="checkout-page_main_info_inner_delivery_title">
            Delivery
          </p>
          <Box className="checkout-page_main_info_inner_delivery_container">
            <Box
              sx={{
                mb: 4,
              }}
            >
              <JoyFormControl>
                <JoyFormLabel
                  id="country-select-label"
                  htmlFor="country-select-id"
                >
                  Country
                </JoyFormLabel>
                <JoySelect
                  id="country-select-id"
                  value={deliveryData.country}
                  onChange={(e, newValue) => {
                    handleCountryChange(newValue);
                  }}
                  slotProps={{
                    button: {
                      id: 'country-select',
                      'aria-labelledby': 'country-select-label country-select',
                    },
                  }}
                  renderValue={(selected) => {
                    const selectedCountry = AVAILABLE_SHIPPING_COUNTRIES.find(
                      (country) => country.value === selected.value
                    );
                    return selectedCountry ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                          loading="lazy"
                          width={20}
                          height={14}
                          srcSet={`https://flagcdn.com/w40/${selectedCountry.value.toLowerCase()}.png 2x`}
                          src={`https://flagcdn.com/w20/${selectedCountry.value.toLowerCase()}.png`}
                          alt={`Flag of ${selectedCountry.label}`}
                          style={{ marginRight: 8 }}
                        />
                        {selectedCountry.label}
                      </Box>
                    ) : (
                      'Select country'
                    );
                  }}
                >
                  {AVAILABLE_SHIPPING_COUNTRIES.map((country) => (
                    <JoyOption key={country.value} value={country.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                          loading="lazy"
                          width={20}
                          height={14}
                          srcSet={`https://flagcdn.com/w40/${country.value.toLowerCase()}.png 2x`}
                          src={`https://flagcdn.com/w20/${country.value.toLowerCase()}.png`}
                          alt={`Flag of ${country.label}`}
                          style={{ marginRight: 8 }}
                        />
                        {country.label}
                      </Box>
                    </JoyOption>
                  ))}
                </JoySelect>
              </JoyFormControl>
            </Box>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={deliveryData.name}
                  onChange={handleNameChange}
                  error={nameError && payButtonClicked}
                  helperText={
                    payButtonClicked && nameError
                      ? nameError || 'Invalid name'
                      : ''
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Surname"
                  variant="outlined"
                  fullWidth
                  value={deliveryData.surname}
                  onChange={handleSurameChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Company (optional)"
                  variant="outlined"
                  fullWidth
                  value={deliveryData.company}
                  onChange={handleCompanyChange}
                />
              </Grid>

              <Grid
                className="checkout-page_main_info_inner_delivery_container_address"
                item
                xs={12}
              >
                <TextField
                  label="Address"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PinDrop />
                      </InputAdornment>
                    ),
                  }}
                  value={deliveryData.address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  error={addressError && payButtonClicked}
                  helperText={
                    payButtonClicked && addressError
                      ? addressError || 'Invalid address'
                      : ''
                  }
                />
                {loadingSuggestions ? (
                  <Box className="checkout-page_main_info_inner_delivery_container_address_suggestions-loader">
                    <CircularProgress size="1.5em" />
                  </Box>
                ) : (
                  addressSuggestions.length > 0 && (
                    <ClickAwayListener
                      onClickAway={() => setAddressSuggestions([])}
                    >
                      <Box className="checkout-page_main_info_inner_delivery_container_address_suggestions-list">
                        {addressSuggestions.map((address, index) => (
                          <Box
                            className="checkout-page_main_info_inner_delivery_container_address_suggestions-list_item"
                            key={index}
                            onClick={() => handleAddressSelect(address)}
                          >
                            {address.name}
                          </Box>
                        ))}
                      </Box>
                    </ClickAwayListener>
                  )
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Apartment, suite, etc. (optional)"
                  variant="outlined"
                  fullWidth
                  value={deliveryData.apartment}
                  onChange={handleApartmentChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="City"
                  variant="outlined"
                  fullWidth
                  value={deliveryData.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  error={cityError && payButtonClicked}
                  helperText={
                    payButtonClicked && cityError
                      ? cityError || 'Invalid city'
                      : ''
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Postal code"
                  variant="outlined"
                  fullWidth
                  value={deliveryData.postalCode}
                  onChange={(e) => handlePostalCodeChange(e.target.value)}
                  error={postalCodeError && payButtonClicked}
                  helperText={
                    payButtonClicked && postalCodeError
                      ? postalCodeError || 'Invalid postal code'
                      : ''
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Phone"
                  variant="outlined"
                  fullWidth
                  value={deliveryData.phoneNumber}
                  onChange={handlePhoneNumberChange}
                  error={phoneNumberError && payButtonClicked}
                  helperText={
                    payButtonClicked && phoneNumberError
                      ? phoneNumberError || 'Invalid phone number'
                      : ''
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </div>
        {ww <= 998 && (
          <div className="checkout-page_main_info_bottom-order-summary">
            <div
              onClick={() => setOrderBodyVisible(!orderBodyVisible)}
              className="checkout-page_main_info_bottom-order-summary_title"
            >
              <p>Order summary</p>
              {orderBodyVisible ? (
                <span>
                  Hide
                  <KeyboardArrowUpIcon />
                </span>
              ) : (
                <span>
                  Show
                  <KeyboardArrowDownIcon />
                </span>
              )}
            </div>
            {orderBodyVisible && (
              <CheckoutPageOrderedItems items={orderedItems} />
            )}
            <CheckoutPageCounting
              items={orderedItems}
              countedBasket={countedBasket}
              promocode={promocode}
            />
          </div>
        )}
        <button
          onClick={handlePayButtonClick}
          className="checkout-page_main_info_inner_pay-button"
          disabled={payButtonLoading}
        >
          {payButtonLoading ? (
            <BeatLoader color="#eefef6" size={ww > 768 ? 12 : 10} />
          ) : (
            'PAY NOW'
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPageInfo;
