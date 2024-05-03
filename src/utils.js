const getCartWithAddedProduct = (state, action) => {
  let newProducts = {};
  const productIndex = state.cartProducts.findIndex(
    (product) => product.id === action.payload
  );
  if (productIndex !== -1) {
    newProducts = state.cartProducts.slice();
    newProducts[productIndex].quantityInCart++;
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
      quantityInCart: 1,
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
  newProducts[productIndex].quantityInCart++;

  return newProducts;
};

const getCartWithDecreasedProduct = (state, action) => {
  let newProducts = state.cartProducts.slice();
  const productIndex = state.cartProducts.findIndex(
    (product) => product.id === action.payload
  );
  if (newProducts[productIndex].quantityInCart === 1) {
    newProducts.filter((product) => product.id !== action.payload);
  } else {
    newProducts = state.cartProducts.slice();
    newProducts[productIndex].quantityInCart--;
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
    items += item.price * item.quantityInCart;

    if (item.sale) {
      subtotal += item.price * item.quantityInCart;
      savings += (item.price - item.sale) * item.quantityInCart;
      total += item.sale * item.quantityInCart;
    } else {
      subtotal += item.price * item.quantityInCart;
      total += item.price * item.quantityInCart;
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
      padding-right: ${window.innerWidth - document.body.offsetWidth}px
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

const sortProducts = (products, sortBy) => {
  let sortedProducts;

  switch (sortBy) {
    case 'relevance':
      sortedProducts = products;
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
        if (a.isNew && !b.isNew) {
          return -1;
        }
        if (!a.isNew && b.isNew) {
          return 1;
        }
        return 0;
      });
      break;
    case 'discount':
      sortedProducts = products.slice().sort((a, b) => {
        if (a.sale && !b.sale) {
          return -1;
        }
        if (!a.sale && b.sale) {
          return 1;
        }
        return 0;
      });
      break;
    default:
      sortedProducts = products;
  }

  return sortedProducts;
};

const findCheapestProductObj = (products) =>
  products.reduce((x, y) => {
    if (x.sale && y.sale && x.sale < y.sale) {
      return x;
    }
    if (x.sale && !y.sale && x.sale < y.price) {
      return x;
    }
    if (!x.sale && y.sale && x.price < y.sale) {
      return x;
    }
    if (!x.sale && !y.sale && x.price < y.price) {
      return x;
    }
    return y;
  });

const findMostExpensiveProductObj = (products) =>
  products.reduce((x, y) => {
    if (x.sale && y.sale && x.sale > y.sale) {
      return x;
    }
    if (x.sale && !y.sale && x.sale > y.price) {
      return x;
    }
    if (!x.sale && y.sale && x.price > y.sale) {
      return x;
    }
    if (!x.sale && !y.sale && x.price > y.price) {
      return x;
    }
    return y;
  });

const getStoreWorkStatus = (calendar) => {
  const day = new Date().getDay();
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();
  const time = +String(hours).concat(String(minutes));
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
  const time = +String(hours).concat(String(minutes));
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
          return `Opens at ${calendar.Monday.open}`;
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
          return `Opens at ${calendar.Tuesday.open}`;
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
          return `Opens at ${calendar.Wednesday.open}`;
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
          return `Opens at ${calendar.Thursday.open}`;
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
          return `Opens at ${calendar.Friday.open}`;
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
          return `Opens at ${calendar.Saturday.open}`;
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
          return `Opens at ${calendar.Sunday.open}`;
        }
      }
      break;
    default:
      return 0;
  }
};

// const setIdByTitle = (data) => {
//   data.forEach((it) => (it.id = it.title.replace(/[-\s]/g, '-')));
//   return data;
// };

export {
  getCartWithAddedProduct,
  getCartWithIncreasedProduct,
  getCartWithDecreasedProduct,
  updateLovelist,
  countTheBasket,
  getUcFirstNoDashStr,
  scrollController,
  debounce,
  sortProducts,
  findCheapestProductObj,
  findMostExpensiveProductObj,
  getStoreWorkStatus,
  getStoreWorkDescription,
};
