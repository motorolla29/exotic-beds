/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';
import axios from 'axios';
import { debounce } from '../../utils';
import {
  Checkbox,
  TextField,
  Box,
  Grid,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import JoyFormControl from '@mui/joy/FormControl';
import JoyFormLabel from '@mui/joy/FormLabel';
import JoySelect from '@mui/joy/Select';
import JoyOption from '@mui/joy/Option';

import { AVAILABLE_SHIPPING_COUNTRIES } from '../../const';

import './checkout-page-info.sass';

const CheckoutPageInfo = () => {
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

  const handleDeliveryDataChange = (field, value) => {
    setDeliveryData((prevData) => ({
      ...prevData,
      [field]: value || '',
    }));
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
  };

  const fetchAddressSuggestions = async (addressQuery, countryCode) => {
    if (!addressQuery) return;

    setLoadingSuggestions(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: addressQuery,
            countrycodes: countryCode, // Ограничиваем поиск по стране
            format: 'json',
            addressdetails: 1,
            limit: 5, // Получаем 5 вариантов
          },
        }
      );
      setAddressSuggestions(response.data || []);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    } finally {
      setLoadingSuggestions(false); // Устанавливаем состояние загрузки в false после завершения запроса
    }
  };

  const debouncedFetchAddressSuggestions = useCallback(
    debounce((addressQuery) => {
      fetchAddressSuggestions(addressQuery, deliveryData.country);
    }, 1000),
    [deliveryData.country] // Добавляем зависимость от страны
  );

  const handleAddressChange = (event) => {
    const addressQuery = event.target.value;
    handleDeliveryDataChange('address', addressQuery);
    debouncedFetchAddressSuggestions(addressQuery);
  };

  const handleAddressSelect = (address) => {
    handleDeliveryDataChange('address', address.display_name);
    handleDeliveryDataChange(
      'city',
      address.address.city || address.address.town
    );
    handleDeliveryDataChange('postalCode', address.address.postcode);
    setAddressSuggestions([]); // Скрыть предложения после выбора
  };

  return (
    <div className="checkout-page_main_info">
      <div className="checkout-page_main_info_inner">
        <div className="checkout-page_main_info_inner_contact">
          <p className="checkout-page_main_info_inner_contact_title">Contact</p>
          <TextField label="Email" variant="outlined" />
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
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={deliveryData.name}
                  onChange={(e) =>
                    handleDeliveryDataChange('name', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Surname"
                  variant="outlined"
                  fullWidth
                  value={deliveryData.surname}
                  onChange={(e) =>
                    handleDeliveryDataChange('surname', e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Company (optional)"
                  variant="outlined"
                  fullWidth
                  value={deliveryData.company}
                  onChange={(e) =>
                    handleDeliveryDataChange('company', e.target.value)
                  }
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
                  value={deliveryData.address}
                  onChange={handleAddressChange}
                />
                {loadingSuggestions ? (
                  <Box className="checkout-page_main_info_inner_delivery_container_address_suggestions-loader">
                    <CircularProgress size="1.5em" />
                  </Box>
                ) : (
                  addressSuggestions.length > 0 && (
                    <Box className="checkout-page_main_info_inner_delivery_container_address_suggestions-list">
                      {addressSuggestions.map((address, index) => (
                        <Box
                          className="checkout-page_main_info_inner_delivery_container_address_suggestions-list_item"
                          key={index}
                          onClick={() => handleAddressSelect(address)}
                        >
                          {address.display_name}
                        </Box>
                      ))}
                    </Box>
                  )
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Apartment, suite, etc. (optional)"
                  variant="outlined"
                  fullWidth
                  value={deliveryData.apartment}
                  onChange={(e) =>
                    handleDeliveryDataChange('apartment', e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="City"
                  variant="outlined"
                  fullWidth
                  value={deliveryData.city}
                  onChange={(e) =>
                    handleDeliveryDataChange('city', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Postal code"
                  variant="outlined"
                  fullWidth
                  value={deliveryData.postalCode}
                  onChange={(e) =>
                    handleDeliveryDataChange('postalCode', e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Phone"
                  variant="outlined"
                  fullWidth
                  value={deliveryData.phoneNumber}
                  onChange={(e) =>
                    handleDeliveryDataChange('phoneNumber', e.target.value)
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </div>
        <button className="checkout-page_main_info_inner_pay-button">
          PAY NOW
        </button>
      </div>
    </div>
  );
};

export default CheckoutPageInfo;
