import getDistance from 'geolib/es/getDistance';
import Resizer from 'react-image-file-resizer';
import { UAParser } from 'ua-parser-js';
import dayjs from 'dayjs';

const nullAndUndefinedToEmptyString = (value) =>
  value === null || value === undefined ? '' : value;

const areDatesEqual = (date1, date2) => {
  if (date1 === null && date2 === null) return true;
  if (date1 === null || date2 === null) return false;
  return dayjs(date1).isSame(dayjs(date2));
};

const generateDeviceIdWithUserAgentAndClientHints = async () => {
  let deviceType = 'Unknown Device';

  if (navigator.userAgentData) {
    const uaData = navigator.userAgentData;
    try {
      const { brands, model, platform, platformVersion } =
        await uaData.getHighEntropyValues([
          'brands',
          'model',
          'platform',
          'platformVersion',
        ]);

      const brand = brands && brands.length > 0 ? brands[0].brand : null;

      if (uaData.mobile) {
        deviceType =
          brand && model && model.length >= 3
            ? `${brand} ${model}`
            : brand
            ? `${brand} Generic Mobile Device`
            : model && model.length >= 3
            ? model
            : 'Generic Mobile Device';
      } else {
        const formattedPlatform = `${platform || 'Unknown'} ${
          platformVersion || ''
        }`.trim();
        deviceType =
          brand && formattedPlatform
            ? `${brand} ${formattedPlatform} Desktop`
            : formattedPlatform
            ? `${formattedPlatform} Desktop`
            : 'Generic Desktop';
      }
    } catch (error) {
      console.error('Failed to retrieve high entropy UA-CH values:', error);
      deviceType = 'Unknown Device';
    }
  } else {
    console.warn(
      'User-Agent Client Hints are not supported. Falling back to basic device info.'
    );
    deviceType = 'Fallback Device';
  }

  //Fallback на User-Agent
  if (
    deviceType.includes('Generic') ||
    deviceType.includes('Unknown') ||
    deviceType.includes('Fallback')
  ) {
    const parser = new UAParser();
    const result = parser.getResult();
    if (result.device.type === 'mobile' || result.device.type === 'tablet') {
      deviceType =
        result.device.model && result.device.model.length >= 3
          ? result.device.model
          : `${
              result.device.type.charAt(0).toUpperCase() +
              result.device.type.slice(1)
            } Device`;
    } else if (result.os.name) {
      const osName = result.os.name || 'Unknown';
      const osVersion = result.os.version ? ` ${result.os.version}` : '';
      deviceType = `${osName}${osVersion} Desktop`;
    } else {
      deviceType = 'Fallback Desktop';
    }
  }

  const randomString = Math.random().toString(36).slice(2, 11).toUpperCase();

  return `${deviceType} ID: ${randomString}`;
};

const resizeImage = (file) => {
  return new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      file,
      1920, // Максимальная ширина
      1920, // Максимальная высота
      'JPEG', // Формат изображения (JPEG, PNG, WEBP)
      75, // Качество (от 0 до 100)
      0, // Ориентация
      (uri) => {
        // В `uri` возвращается сжатое изображение
        const resizedFile = new File([uri], file.name, { type: 'image/jpeg' });
        resolve(resizedFile);
      },
      'blob' // Формат результата (можно использовать 'blob' или 'base64')
    );
  });
};

const getCartWithAddedProduct = (state, action) => {
  let newProducts = {};
  const productIndex = state.cartProducts.findIndex(
    (product) => product.id === action.payload
  );
  if (productIndex !== -1) {
    newProducts = state.cartProducts.slice();
    newProducts[productIndex].quantity++;
  } else {
    const item = state.products.find((item) => item.id === action.payload);
    const newCartProduct = {
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      photo: item.photo,
      price: item.price,
      sale: item.sale,
      rating: item.rating,
      availableQuantity: item.availableQuantity,
      quantity: 1,
    };
    newProducts = [...state.cartProducts, newCartProduct];
  }

  return newProducts;
};

const getCartWithIncreasedProduct = (state, action) => {
  let newProducts = {};
  const productIndex = state.cartProducts.findIndex(
    (product) => product.id === action.payload
  );
  newProducts = state.cartProducts.slice();
  newProducts[productIndex].quantity++;

  return newProducts;
};

const getCartWithDecreasedProduct = (state, action) => {
  let newProducts = state.cartProducts.slice();
  const productIndex = state.cartProducts.findIndex(
    (product) => product.id === action.payload
  );
  if (newProducts[productIndex].quantity === 1) {
    newProducts.filter((product) => product.id !== action.payload);
  } else {
    newProducts = state.cartProducts.slice();
    newProducts[productIndex].quantity--;
  }

  return newProducts;
};

const updateLovelist = (state, action) => {
  let newProducts = [];
  const productIndex = state.lovelistProducts.findIndex(
    (product) => product.id === action.payload
  );
  if (productIndex !== -1) {
    newProducts = state.lovelistProducts.filter(
      (product) => product.id !== action.payload
    );
  } else {
    const item = state.products.find((item) => item.id === action.payload);
    const newLovelistProduct = {
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      photo: item.photo,
      price: item.price,
      sale: item.sale,
      rating: item.rating,
      availableQuantity: item.availableQuantity,
    };
    newProducts = [...state.lovelistProducts, newLovelistProduct];
  }

  return newProducts;
};

const countTheBasket = (products) => {
  let items = 0;
  let subtotal = 0;
  let savings = 0;
  let delivery = 0;
  let total = 0;

  products.forEach((item) => {
    items += item.price * item.quantity;

    if (item.sale) {
      subtotal += item.price * item.quantity;
      savings += (item.price - item.sale) * item.quantity;
      total += item.sale * item.quantity;
    } else {
      subtotal += item.price * item.quantity;
      total += item.price * item.quantity;
    }
  });

  if (total > 2000) {
    delivery = 'FREE';
  } else if (total < 2000) {
    total += 500;
    delivery = 500;
  }

  return {
    items: items,
    subtotal: subtotal,
    delivery: delivery,
    savings: savings,
    total: total,
  };
};

const getUcFirstNoDashStr = (str) => {
  if (!str) return str;

  return str[0].toUpperCase() + str.replace(/-/g, ' ').slice(1);
};

const scrollController = {
  scrollPosition: 0,
  disabledScroll() {
    scrollController.scrollPosition = window.scrollY;
    document.body.style.cssText = `
      position: fixed;
      top: -${scrollController.scrollPosition}px;
      left: 0;
      height: 100vh;
      width: 100vw;
      padding-right: ${window.innerWidth - document.body.offsetWidth}px;
      overflow: visible !important
    `;
    document.documentElement.style.scrollBehavior = 'unset';
  },
  enabledScroll() {
    document.body.style.cssText = '';
    window.scroll({ top: scrollController.scrollPosition });
    document.documentElement.style.scrollBehavior = '';
  },
};

const debounce = (fn, wait) => {
  let timeout;

  // returns a new function
  return (args) => {
    //clears any exiting timeout.
    //This ensures every time the function is called again a new timeout is created.
    clearTimeout(timeout);

    //creates a new timeout with a callback as our original function.
    //wait is the number of milliseconds to wait before invoking the callback
    //args is the arguments passed to the callback
    //So if this function is not called again in next number of milli seconds in wait,
    //our callback function i.e original fn is executed.
    timeout = setTimeout(fn, wait, args);
  };
};

const calculateRelevance = (product, searchArray) => {
  let score = 0;

  const title = product.title?.toLowerCase() || '';
  const description = product.description?.toLowerCase() || '';

  searchArray.forEach((word) => {
    if (!word) return;

    // Считаем количество вхождений слова
    const titleMatches = title.split(word).length - 1;
    const descMatches = description.split(word).length - 1;

    // Приоритет названия перед описанием
    score += titleMatches * 10;
    score += descMatches * 5;

    // Дополнительные очки, если слово в начале названия
    if (title.startsWith(word)) score += 15;

    // Полное совпадение с названием дает бонус
    if (title === word) score += 20;
  });

  // Дополнительные баллы за рейтинг
  score += product.rating;

  return score;
};

const sortProducts = (products, sortBy) => {
  let sortedProducts;

  switch (sortBy) {
    case 'relevance':
      sortedProducts = sortedProducts = products.slice().sort((a, b) => {
        const dateA = a.createdAt
          ? new Date(a.createdAt)
          : a.updatedAt
          ? new Date(a.updatedAt)
          : new Date(0);
        const dateB = b.createdAt
          ? new Date(b.createdAt)
          : b.updatedAt
          ? new Date(b.updatedAt)
          : new Date(0);
        return dateB - dateA;
      });
      break;
    case 'price_asc':
      sortedProducts = products
        .slice()
        .sort((a, b) => (a.sale || a.price) - (b.sale || b.price));
      break;
    case 'price_desc':
      sortedProducts = products
        .slice()
        .sort((a, b) => (b.sale || b.price) - (a.sale || a.price));
      break;
    case 'rating':
      sortedProducts = products.slice().sort((a, b) => b.rating - a.rating);
      break;
    case 'recent':
      sortedProducts = products.slice().sort((a, b) => {
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;

        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);

        return dateB - dateA;
      });
      break;
    case 'discount':
      sortedProducts = products.slice().sort((a, b) => {
        if (!a.sale && !b.sale) {
          return 0;
        }
        if (!a.sale) {
          return 1;
        }
        if (!b.sale) {
          return -1;
        }
        if (a.price - a.sale < b.price - b.sale) {
          return 1;
        }
        if (a.price - a.sale > b.price - b.sale) {
          return -1;
        }
        return 0;
      });
      break;
    default:
      sortedProducts = sortedProducts = products.slice().sort((a, b) => {
        const dateA = a.createdAt
          ? new Date(a.createdAt)
          : a.updatedAt
          ? new Date(a.updatedAt)
          : new Date(0);
        const dateB = b.createdAt
          ? new Date(b.createdAt)
          : b.updatedAt
          ? new Date(b.updatedAt)
          : new Date(0);
        return dateB - dateA;
      });
  }

  return sortedProducts;
};

const sortProductsForSearch = (products, searchArray) => {
  // Если поисковой массив пуст, возвращаем исходный массив товаров
  if (!searchArray.length) return products;

  // Сортируем копию массива товаров по релевантности
  return products.slice().sort((a, b) => {
    const relevanceA = calculateRelevance(a, searchArray);
    const relevanceB = calculateRelevance(b, searchArray);
    return relevanceB - relevanceA; // Более релевантный товар — выше
  });
};

const findCheapestProductObj = (products) => {
  if (!products || !products.length) {
    return null;
  }
  return products.reduce((x, y) => {
    if (+x.sale && +y.sale && +x.sale < +y.sale) {
      return x;
    }
    if (+x.sale && +!y.sale && +x.sale < +y.price) {
      return x;
    }
    if (+!x.sale && y.sale && +x.price < +y.sale) {
      return x;
    }
    if (+!x.sale && +!y.sale && +x.price < +y.price) {
      return x;
    }
    return y;
  });
};

const findMostExpensiveProductObj = (products) => {
  if (!products || !products.length) {
    return null;
  }
  return products.reduce((x, y) => {
    if (+x.sale && +y.sale && +x.sale > +y.sale) {
      return x;
    }
    if (+x.sale && +!y.sale && +x.sale > +y.price) {
      return x;
    }
    if (+!x.sale && +y.sale && +x.price > +y.sale) {
      return x;
    }
    if (+!x.sale && +!y.sale && +x.price > +y.price) {
      return x;
    }
    return y;
  });
};

const getStoreWorkStatus = (calendar) => {
  const day = new Date().getDay();
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();
  const time = hours * 100 + minutes;
  switch (day) {
    case 0:
      if (
        time > +calendar.Sunday.open.replace(/[^0-9]/g, '') &&
        time < +calendar.Sunday.close.replace(/[^0-9]/g, '')
      ) {
        return true;
      } else {
        return false;
      }
    case 1:
      if (
        time > +calendar.Monday.open.replace(/[^0-9]/g, '') &&
        time < +calendar.Monday.close.replace(/[^0-9]/g, '')
      ) {
        return true;
      } else {
        return false;
      }
    case 2:
      if (
        time > +calendar.Tuesday.open.replace(/[^0-9]/g, '') &&
        time < +calendar.Tuesday.close.replace(/[^0-9]/g, '')
      ) {
        return true;
      } else {
        return false;
      }
    case 3:
      if (
        time > +calendar.Wednesday.open.replace(/[^0-9]/g, '') &&
        time < +calendar.Wednesday.close.replace(/[^0-9]/g, '')
      ) {
        return true;
      } else {
        return false;
      }
    case 4:
      if (
        time > +calendar.Thursday.open.replace(/[^0-9]/g, '') &&
        time < +calendar.Thursday.close.replace(/[^0-9]/g, '')
      ) {
        return true;
      } else {
        return false;
      }
    case 5:
      if (
        time > +calendar.Friday.open.replace(/[^0-9]/g, '') &&
        time < +calendar.Friday.close.replace(/[^0-9]/g, '')
      ) {
        return true;
      } else {
        return false;
      }
    case 6:
      if (
        time > +calendar.Saturday.open.replace(/[^0-9]/g, '') &&
        time < +calendar.Saturday.close.replace(/[^0-9]/g, '')
      ) {
        return true;
      } else {
        return false;
      }
    default:
      return false;
  }
};

const getStoreWorkDescription = (isOpen, calendar) => {
  const day = new Date().getDay();
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();
  const time = hours * 100 + minutes;
  switch (day) {
    case 0:
      if (isOpen) {
        return `Closes at ${calendar.Sunday.close}`;
      }
      if (!isOpen) {
        if (time < +calendar.Sunday.open.replace(/[^0-9]/g, '')) {
          return `Opens at ${calendar.Sunday.open}`;
        }
        if (time > +calendar.Sunday.open.replace(/[^0-9]/g, '')) {
          return `Opens at ${calendar.Monday.open} tomorrow`;
        }
      }
      break;
    case 1:
      if (isOpen) {
        return `Closes at ${calendar.Monday.close}`;
      }
      if (!isOpen) {
        if (time < +calendar.Monday.open.replace(/[^0-9]/g, '')) {
          return `Opens at ${calendar.Monday.open}`;
        }
        if (time > +calendar.Monday.open.replace(/[^0-9]/g, '')) {
          return `Opens at ${calendar.Tuesday.open} tomorrow`;
        }
      }
      break;
    case 2:
      if (isOpen) {
        return `Closes at ${calendar.Tuesday.close}`;
      }
      if (!isOpen) {
        if (time < +calendar.Tuesday.open.replace(/[^0-9]/g, '')) {
          return `Opens at ${calendar.Tuesday.open}`;
        }
        if (time > +calendar.Tuesday.open.replace(/[^0-9]/g, '')) {
          return `Opens at ${calendar.Wednesday.open} tomorrow`;
        }
      }
      break;
    case 3:
      if (isOpen) {
        return `Closes at ${calendar.Wednesday.close}`;
      }
      if (!isOpen) {
        if (time < +calendar.Wednesday.open.replace(/[^0-9]/g, '')) {
          return `Opens at ${calendar.Wednesday.open}`;
        }
        if (time > +calendar.Wednesday.open.replace(/[^0-9]/g, '')) {
          return `Opens at ${calendar.Thursday.open} tomorrow`;
        }
      }
      break;
    case 4:
      if (isOpen) {
        return `Closes at ${calendar.Thursday.close}`;
      }
      if (!isOpen) {
        if (time < +calendar.Thursday.open.replace(/[^0-9]/g, '')) {
          return `Opens at ${calendar.Thursday.open}`;
        }
        if (time > +calendar.Thursday.open.replace(/[^0-9]/g, '')) {
          return `Opens at ${calendar.Friday.open} tomorrow`;
        }
      }
      break;
    case 5:
      if (isOpen) {
        return `Closes at ${calendar.Friday.close}`;
      }
      if (!isOpen) {
        if (time < +calendar.Friday.open.replace(/[^0-9]/g, '')) {
          return `Opens at ${calendar.Friday.open}`;
        }
        if (time > +calendar.Friday.open.replace(/[^0-9]/g, '')) {
          return `Opens at ${calendar.Saturday.open} tomorrow`;
        }
      }
      break;
    case 6:
      if (isOpen) {
        return `Closes at ${calendar.Saturday.close}`;
      }
      if (!isOpen) {
        if (time < +calendar.Saturday.open.replace(/[^0-9]/g, '')) {
          return `Opens at ${calendar.Saturday.open}`;
        }
        if (time > +calendar.Saturday.open.replace(/[^0-9]/g, '')) {
          return `Opens at ${calendar.Sunday.open} tomorrow`;
        }
      }
      break;
    default:
      return 'Closed';
  }
};

const sortStoresByProximity = (stores, coords) => {
  return stores.sort(function (a, b) {
    if (
      getDistance(
        {
          latitude: a.geometry.coordinates[1],
          longitude: a.geometry.coordinates[0],
        },
        coords
      ) >
      getDistance(
        {
          latitude: b.geometry.coordinates[1],
          longitude: b.geometry.coordinates[0],
        },
        coords
      )
    ) {
      return 1;
    }
    if (
      getDistance(
        {
          latitude: a.geometry.coordinates[1],
          longitude: a.geometry.coordinates[0],
        },
        coords
      ) <
      getDistance(
        {
          latitude: b.geometry.coordinates[1],
          longitude: b.geometry.coordinates[0],
        },
        coords
      )
    ) {
      return -1;
    }
    return 0;
  });
};

const randomInteger = (min, max) => {
  // случайное число от min до (max+1)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

// const setIdByTitle = (data) => {
//   data.forEach((it) => (it.id = it.title.replace(/[-\s]/g, '-')));
//   return data;
// };

const categoriesIds = {
  beds: 1,
  sofas: 2,
  armchairs: 3,
  kids: 4,
  poufs: 5,
};

const getCurrencySymbol = (currencyCode, locale = 'en-US') => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const parts = formatter.formatToParts(0);
  const currencyPart = parts.find((part) => part.type === 'currency');
  return currencyPart ? currencyPart.value : '';
};

const updateLocalStorageBasketItemsQuantity = (
  itemsToUpdate,
  loadedProducts
) => {
  if (!itemsToUpdate || !Array.isArray(itemsToUpdate)) return [];

  return itemsToUpdate
    .map((item) => {
      const updatedProduct = loadedProducts.find((p) => p.id === item.id);
      return updatedProduct
        ? { ...item, availableQuantity: updatedProduct.availableQuantity }
        : null;
    })
    .filter(Boolean);
};

export {
  nullAndUndefinedToEmptyString,
  areDatesEqual,
  generateDeviceIdWithUserAgentAndClientHints,
  resizeImage,
  getCartWithAddedProduct,
  getCartWithIncreasedProduct,
  getCartWithDecreasedProduct,
  updateLovelist,
  countTheBasket,
  getUcFirstNoDashStr,
  scrollController,
  debounce,
  calculateRelevance,
  sortProducts,
  sortProductsForSearch,
  findCheapestProductObj,
  findMostExpensiveProductObj,
  getStoreWorkStatus,
  getStoreWorkDescription,
  sortStoresByProximity,
  randomInteger,
  categoriesIds,
  getCurrencySymbol,
  updateLocalStorageBasketItemsQuantity,
};
