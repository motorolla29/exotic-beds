import { createAction } from '@reduxjs/toolkit';

const loadProducts = createAction(`LOAD_PRODUCTS`, (products) => ({
  payload: products,
}));

const productsAreLoaded = createAction(`PRODUCTS_LOADED`, (bool) => ({
  payload: bool,
}));

const cartOpen = createAction(`SET_IS_CART_OPEN`, (bool) => ({
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

const toggleProductInLovelist = createAction(
  `TOGGLE_PRODUCT_IN_LOVELIST`,
  (productId) => ({
    payload: productId,
  })
);

const setMapViewState = createAction('SET_MAP_VIEW_STATE', (viewState) => ({
  payload: viewState,
}));

const setNearStoresCenter = createAction(
  'SET_NEAR_STORES_CENTER',
  (coords) => ({
    payload: coords,
  })
);

const setSnackbar = createAction('SET_SNACKBAR', (options) => ({
  payload: options,
}));

export {
  loadProducts,
  productsAreLoaded,
  cartOpen,
  addProductToCart,
  removeProductFromCart,
  increaseProductAmountInCart,
  decreaseProductAmountInCart,
  toggleProductInLovelist,
  setMapViewState,
  setNearStoresCenter,
  setSnackbar,
};
