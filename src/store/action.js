import { createAction } from '@reduxjs/toolkit';

const setOverlayLoader = createAction(`SET_OVERLAY_LOADER`, (bool) => ({
  payload: bool,
}));

const setIsAuth = createAction(`SET_IS_AUTH`, (bool) => ({
  payload: bool,
}));

const setProductsLoaded = createAction(`SET_PRODUCTS_LOADED`, (bool) => ({
  payload: bool,
}));

const setUser = createAction(`SET_USER`, (user) => ({
  payload: user,
}));

const setProducts = createAction(`SET_PRODUCTS`, (data) => ({
  payload: data,
}));

const setCart = createAction(`SET_CART`, (cart) => ({
  payload: cart,
}));

const setLovelist = createAction(`SET_LOVELIST`, (lovelist) => ({
  payload: lovelist,
}));

const loadProducts = createAction(`LOAD_PRODUCTS`, (products) => ({
  payload: products,
}));

const productsAreLoaded = createAction(`PRODUCTS_LOADED`, (bool) => ({
  payload: bool,
}));

const cartOpen = createAction(`SET_IS_CART_OPEN`, (bool) => ({
  payload: bool,
}));

const loginModalsOpen = createAction(`SET_IS_LOGIN_MODALS_OPEN`, (bool) => ({
  payload: bool,
}));

const setNotificationModal = createAction(
  `SET_NOTIFICATION_MODAL`,
  (options) => ({
    payload: options,
  })
);
const setConfirmationModal = createAction(
  `SET_CONFIRMATION_MODAL`,
  (options) => ({
    payload: options,
  })
);

// const addProductToCart = createAction(`ADD_PRODUCT_TO_CART`, (productId) => ({
//   payload: productId,
// }));

// const removeProductFromCart = createAction(
//   `REMOVE_PRODUCT_FROM_CART`,
//   (productId) => ({
//     payload: productId,
//   })
// );

// const increaseProductAmountInCart = createAction(
//   `INCREASE_PRODUCT_AMOUNT_IN_CART`,
//   (productId) => ({
//     payload: productId,
//   })
// );

// const decreaseProductAmountInCart = createAction(
//   `DECREASE_PRODUCT_AMOUNT_IN_CART`,
//   (productId) => ({
//     payload: productId,
//   })
// );

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
  setOverlayLoader,
  setIsAuth,
  setProductsLoaded,
  setUser,
  setProducts,
  setCart,
  setLovelist,
  loadProducts,
  productsAreLoaded,
  cartOpen,
  loginModalsOpen,
  setNotificationModal,
  setConfirmationModal,
  // addProductToCart,
  // removeProductFromCart,
  // increaseProductAmountInCart,
  // decreaseProductAmountInCart,
  toggleProductInLovelist,
  setMapViewState,
  setNearStoresCenter,
  setSnackbar,
};
