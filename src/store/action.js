import { createAction } from '@reduxjs/toolkit';

const loadProducts = createAction(`LOAD_PRODUCTS`, (products) => ({
  payload: products,
}));

const productsAreLoaded = createAction(`PRODUCTS_LOADED`, (bool) => ({
  payload: bool,
}));

const addProductToCart = createAction(`ADD_PRODUCT_TO_CART`, (productId) => ({
  payload: productId,
}));

const removeProductFromCart = createAction(
  `REMOVE_PRODUCT_FROM_CART`,
  (productId) => ({
    payload: productId,
  })
);

const increaseProductAmountInCart = createAction(
  `INCREASE_PRODUCT_AMOUNT_IN_CART`,
  (productId) => ({
    payload: productId,
  })
);

const decreaseProductAmountInCart = createAction(
  `DECREASE_PRODUCT_AMOUNT_IN_CART`,
  (productId) => ({
    payload: productId,
  })
);

const changeCartTotalCount = createAction(
  `CHANGE_CART_TOTAL_COUNT`,
  (productId) => ({
    payload: productId,
  })
);

const toggleProductInLovelist = createAction(
  `TOGGLE_PRODUCT_IN_LOVELIST`,
  (productId) => ({
    payload: productId,
  })
);

const changeCategory = createAction(`CHANGE_CATEGORY`, (category) => ({
  payload: category,
}));

export {
  loadProducts,
  productsAreLoaded,
  addProductToCart,
  removeProductFromCart,
  increaseProductAmountInCart,
  decreaseProductAmountInCart,
  changeCartTotalCount,
  toggleProductInLovelist,
  changeCategory,
};
