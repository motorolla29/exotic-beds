const addProductToCart = (state, action) => {
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
      quantityInCart: 1,
    };
    newProducts = [...state.cartProducts, newCartProduct];
  }

  return {
    ...state,
    cartProducts: newProducts,
  };
};

const increaseProductAmountInCart = (state, action) => {
  let newProducts = {};
  const productIndex = state.cartProducts.findIndex(
    (product) => product.id === action.payload
  );
  newProducts = state.cartProducts.slice();
  newProducts[productIndex].quantity++;

  return {
    ...state,
    cartProducts: newProducts,
  };
};

const decreaseProductAmountInCart = (state, action) => {
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

  return {
    ...state,
    cartProducts: newProducts,
  };
};

const toggleProductInLovelist = (state, action) => {
  let newProducts = {};
  const productIndex = state.lovelistProducts.findIndex(
    (product) => product.id === action.payload
  );
  if (productIndex !== -1) {
    newProducts = state.items.slice();
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

  return {
    ...state,
    lovelistProducts: newProducts,
  };
};

export {
  addProductToCart,
  increaseProductAmountInCart,
  decreaseProductAmountInCart,
  toggleProductInLovelist,
};
