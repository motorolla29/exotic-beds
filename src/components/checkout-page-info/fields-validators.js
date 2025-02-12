import { AVAILABLE_SHIPPING_COUNTRIES } from '../../const';

export const validateEmail = (email) => {
  if (!email.trim()) {
    return 'Email is required.';
  }
  const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!emailPattern.test(email)) {
    return 'Invalid email format.';
  }
  return null;
};

export const validateName = (name) => {
  if (!name.trim()) {
    return 'Name is required.';
  }
  if (name.length < 2) {
    return 'Name must be at least 2 characters long.';
  }
  if (!/^[\p{L}\s]+$/u.test(name)) {
    return 'Name can only contain letters and spaces.';
  }
  return null;
};

export const validateAddress = (address) => {
  if (!address.trim()) {
    return 'Address is required.';
  }
  if (address.length < 5) {
    return 'Address must be at least 5 characters long.';
  }
  if (!/^[\p{L}\p{N}\s,.-]+$/u.test(address)) {
    return 'Address contains invalid characters.';
  }
  return null;
};

export const validateCity = (city) => {
  if (!city.trim()) {
    return 'City is required.';
  }
  if (!/^[\p{L}][\p{L}\d\s\-'’.]*$/u.test(city)) {
    return 'City can only contain letters and spaces.';
  }
  return null;
};

export const validatePostalCode = (postalCode, countryCode) => {
  if (!postalCode.trim()) {
    return 'Postal code is required.';
  }

  const country = AVAILABLE_SHIPPING_COUNTRIES.find(
    (c) => c.value === countryCode
  );
  if (!country) {
    return `Country not supported (${countryCode}).`;
  }

  const { pattern } = country;

  if (!pattern.test(postalCode)) {
    return `Invalid postal code format for ${country.label}.`;
  }

  return null;
};

export const validatePhone = (phone) => {
  if (!phone.trim()) {
    return null;
  }
  if (!/^[0-9]{10,15}$/.test(phone)) {
    return 'Phone number must be 10-15 digits.';
  }
  return null;
};
