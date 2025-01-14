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
  InputAdornment,
} from '@mui/material';
import JoyFormControl from '@mui/joy/FormControl';
import JoyFormLabel from '@mui/joy/FormLabel';
import JoySelect from '@mui/joy/Select';
import JoyOption from '@mui/joy/Option';
import { ClickAwayListener } from '@mui/base';
import PinDropIcon from '@mui/icons-material/PinDrop';
import { AVAILABLE_SHIPPING_COUNTRIES, MAPTILER_API_KEY } from '../../const';

import './checkout-page-info.sass';
import { PinDrop } from '@mui/icons-material';

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
    if (!addressQuery.trim()) return;

    setLoadingSuggestions(true);
    try {
      const response = await axios.get(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(
          addressQuery
        )}.json`,
        {
          params: {
            key: MAPTILER_API_KEY,
            limit: 5,
            language: 'en',
            country: countryCode || undefined, // Передаем код страны, если он указан
          },
        }
      );

      const results = response.data.features || [];
      setAddressSuggestions(
        results.map((feature) => ({
          name: feature.place_name, // Полное название места
          city:
            feature.context?.find((c) => c.id.includes('municipality'))?.text ||
            feature.context?.find((c) => c.id.startsWith('subregion'))?.text ||
            feature.context?.find((c) => c.id.startsWith('county'))?.text ||
            '',
          postalCode:
            feature.context?.find((c) => c.id.startsWith('postal_code'))
              ?.text || '',
          displayName: feature.place_name, // Для отображения
        }))
      );
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setAddressSuggestions([]); // Сбрасываем список подсказок при ошибке
    } finally {
      setLoadingSuggestions(false);
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

  const handleAddressSelect = (selectedFeature) => {
    handleDeliveryDataChange('address', selectedFeature.displayName);
    handleDeliveryDataChange('city', selectedFeature.city);
    handleDeliveryDataChange('postalCode', selectedFeature.postalCode);
    // handleDeliveryDataChange('address', address.display_name);
    // handleDeliveryDataChange(
    //   'city',
    //   address.address.city || address.address.town
    // );
    // handleDeliveryDataChange('postalCode', address.address.postcode);
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
            <Grid container spacing={2.5}>
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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PinDrop />
                      </InputAdornment>
                    ),
                  }}
                  value={deliveryData.address}
                  onChange={handleAddressChange}
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
                            {address.displayName}
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
