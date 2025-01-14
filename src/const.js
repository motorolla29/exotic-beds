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
  { label: 'United States', value: 'US' },
  { label: 'Canada', value: 'CA' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'Germany', value: 'DE' },
  { label: 'France', value: 'FR' },
  { label: 'Italy', value: 'IT' },
  { label: 'China', value: 'CN' },
  { label: 'Australia', value: 'AU' },
  { label: 'India', value: 'IN' },
  { label: 'Russia', value: 'RU' },
  { label: 'Japan', value: 'JP' },
  { label: 'Brazil', value: 'BR' },
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
