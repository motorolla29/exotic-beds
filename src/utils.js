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

export {
  getCartWithAddedProduct,
  getCartWithIncreasedProduct,
  getCartWithDecreasedProduct,
  updateLovelist,
  countTheBasket,
  getUcFirstNoDashStr,
  scrollController,
  debounce,
};
