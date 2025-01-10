import { useState } from 'react';
import {
  Checkbox,
  TextField,
  Box,
  Typography,
  Grid,
  FormControlLabel,
} from '@mui/material';
import { GeocodingControl } from '@maptiler/geocoding-control/react';
import { MAPTILER_API_KEY } from '../../const';

import './checkout-page-info.sass';

const CheckoutPageInfo = () => {
  const [address, setAddress] = useState({
    country: '',
    city: '',
    postalCode: '',
    street: '',
    house: '',
    apartment: '',
    company: '',
  });

  const handleAddressChange = (key, value) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
  };

  const handleGeocodingSelect = (result) => {
    console.log(result);
    // const components = result.properties;
    // setAddress({
    //   country: components.country || '',
    //   city: components.city || '',
    //   postalCode: components.postcode || '',
    //   street: components.street || '',
    //   house: '',
    //   apartment: '',
    //   company: '',
    // });
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
          <Box
            sx={{
              p: 4,
              border: '1px solid #ddd',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Shipping address
            </Typography>
            <Box sx={{ mb: 2 }}>
              <GeocodingControl
                apiKey={MAPTILER_API_KEY}
                placeholder="Enter address"
                onSelect={handleGeocodingSelect}
              />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Country/Region"
                  variant="outlined"
                  fullWidth
                  value={address.country}
                  onChange={(e) =>
                    handleAddressChange('country', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="City"
                  variant="outlined"
                  fullWidth
                  value={address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="ZIP code"
                  variant="outlined"
                  fullWidth
                  value={address.postalCode}
                  onChange={(e) =>
                    handleAddressChange('postalCode', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Street"
                  variant="outlined"
                  fullWidth
                  value={address.street}
                  onChange={(e) =>
                    handleAddressChange('street', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="House"
                  variant="outlined"
                  fullWidth
                  value={address.house}
                  onChange={(e) => handleAddressChange('house', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Apartment, suite, etc. (optional)"
                  variant="outlined"
                  fullWidth
                  value={address.apartment}
                  onChange={(e) =>
                    handleAddressChange('apartment', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Company (optional)"
                  variant="outlined"
                  fullWidth
                  value={address.company}
                  onChange={(e) =>
                    handleAddressChange('company', e.target.value)
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </div>
        <div className="checkout-page_main_info_inner_payment">
          <p className="checkout-page_main_info_inner_payment_title">Payment</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPageInfo;
