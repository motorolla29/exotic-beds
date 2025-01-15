const PRODUCT_CATEGORIES = ['Beds', 'Sofas', 'Armchairs', 'Kids', 'Poufs'];

const PRODUCT_SERIES = [
  'Classic',
  'Sea',
  'Pokemon',
  'Totoro',
  'Stitch',
  'Shrek',
  'Sponge Bob',
  'Car',
  'Fruit',
  'Coral',
  'Cyberpunk',
];

const AVAILABLE_SHIPPING_COUNTRIES = [
  {
    label: 'United States',
    value: 'US',
    pattern: /^\d{5}(-\d{4})?$/, // Формат: 12345 или 12345-6789
  },
  {
    label: 'Canada',
    value: 'CA',
    pattern: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, // Формат: A1A 1A1 или A1A1A1
  },
  {
    label: 'United Kingdom',
    value: 'GB',
    pattern: /^[A-Za-z]{1,2}\d{1,2}[A-Za-z]?[ ]?\d[A-Za-z]{2}$/, // Формат: EC1A 1BB
  },
  {
    label: 'Germany',
    value: 'DE',
    pattern: /^\d{5}$/, // Формат: 12345
  },
  {
    label: 'France',
    value: 'FR',
    pattern: /^\d{5}$/, // Формат: 12345
  },
  {
    label: 'Italy',
    value: 'IT',
    pattern: /^\d{5}$/, // Формат: 12345
  },
  {
    label: 'China',
    value: 'CN',
    pattern: /^\d{6}$/, // Формат: 123456
  },
  {
    label: 'Australia',
    value: 'AU',
    pattern: /^\d{4}$/, // Формат: 1234
  },
  {
    label: 'India',
    value: 'IN',
    pattern: /^\d{6}$/, // Формат: 123456
  },
  {
    label: 'Russia',
    value: 'RU',
    pattern: /^\d{6}$/, // Формат: 123456
  },
  {
    label: 'Japan',
    value: 'JP',
    pattern: /^\d{3}-\d{4}$/, // Формат: 123-4567
  },
  {
    label: 'Brazil',
    value: 'BR',
    pattern: /^\d{5}-?\d{3}$/, // Формат: 12345-678 или 12345678
  },
];

const MAPTILER_API_KEY = 'JiORwzpLecOFb1wih0mU';
const GOOGLE_API_KEY = '11111';

const VERCEL_MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5 MB в байтах

export {
  PRODUCT_CATEGORIES,
  PRODUCT_SERIES,
  AVAILABLE_SHIPPING_COUNTRIES,
  MAPTILER_API_KEY,
  GOOGLE_API_KEY,
  VERCEL_MAX_FILE_SIZE,
};
