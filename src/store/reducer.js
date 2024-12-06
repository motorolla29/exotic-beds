import { createReducer } from '@reduxjs/toolkit';

import {
  setOverlayLoader,
  setIsAuth,
  setProductsLoaded,
  setUser,
  setProducts,
  loadProducts,
  productsAreLoaded,
  cartOpen,
  setCart,
  // addProductToCart,
  // removeProductFromCart,
  // increaseProductAmountInCart,
  // decreaseProductAmountInCart,
  setLovelist,
  // toggleProductInLovelist,
  setMapViewState,
  setNearStoresCenter,
  setSnackbar,
  loginModalsOpen,
  setNotificationModal,
  setConfirmationModal,
} from './action';

// import {
//   getCartWithAddedProduct,
//   getCartWithIncreasedProduct,
//   getCartWithDecreasedProduct,
//   updateLovelist,
// } from '../utils';

//import PRODUCTS from '../data/products';

const initialState = {
  overlayLoader: true,
  productsLoaded: false,
  isAuth: false,
  user: {},
  products: [],
  isCartOpen: false,
  isLoginModalsOpen: false,
  confirmationModal: {},
  notificationModal: {},
  sortType: null,
  cartProducts: [],
  lovelistProducts: [],
  mapViewState: {
    latitude: 47.321788,
    longitude: 8.397063,
    zoom: 1.9,
  },
  nearStoresCenter: { latitude: 55.751244, longitude: 37.618423 },
  snackbar: {
    open: false,
    text: '',
    decorator: null,
    id: null,
  },
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setOverlayLoader, (state, action) => {
      state.overlayLoader = action.payload;
    })
    .addCase(setProductsLoaded, (state, action) => {
      state.productsLoaded = action.payload;
    })
    .addCase(setIsAuth, (state, action) => {
      state.isAuth = action.payload;
    })
    .addCase(setUser, (state, action) => {
      state.user = action.payload;
    })
    .addCase(setProducts, (state, action) => {
      state.products = action.payload.slice();
    })
    .addCase(loadProducts, (state, action) => {
      state.products = action.payload;
    })
    .addCase(productsAreLoaded, (state, action) => {
      state.productsAreLoaded = action.payload;
    })
    .addCase(cartOpen, (state, action) => {
      state.isCartOpen = action.payload;
    })
    .addCase(loginModalsOpen, (state, action) => {
      state.loginModalsOpen = action.payload;
    })
    .addCase(setNotificationModal, (state, action) => {
      state.notificationModal = action.payload;
    })
    .addCase(setConfirmationModal, (state, action) => {
      state.confirmationModal = action.payload;
    })
    .addCase(setCart, (state, action) => {
      state.cartProducts = action.payload.slice();
    })
    // .addCase(addProductToCart, (state, action) => {
    //   state.cartProducts = getCartWithAddedProduct(state, action);
    //   localStorage.setItem('cart', JSON.stringify(state.cartProducts));
    // })
    // .addCase(removeProductFromCart, (state, action) => {
    //   state.cartProducts = state.cartProducts.filter(
    //     (product) => product.id !== action.payload
    //   );
    //   localStorage.setItem('cart', JSON.stringify(state.cartProducts));
    // })
    // .addCase(increaseProductAmountInCart, (state, action) => {
    //   state.cartProducts = getCartWithIncreasedProduct(state, action);
    //   localStorage.setItem('cart', JSON.stringify(state.cartProducts));
    // })
    // .addCase(decreaseProductAmountInCart, (state, action) => {
    //   state.cartProducts = getCartWithDecreasedProduct(state, action);
    //   localStorage.setItem('cart', JSON.stringify(state.cartProducts));
    // })
    .addCase(setLovelist, (state, action) => {
      state.lovelistProducts = action.payload.slice();
    })
    // .addCase(toggleProductInLovelist, (state, action) => {
    //   state.lovelistProducts = updateLovelist(state, action);
    //   localStorage.setItem('lovelist', JSON.stringify(state.lovelistProducts));
    // })
    .addCase(setMapViewState, (state, action) => {
      state.mapViewState = action.payload;
    })
    .addCase(setNearStoresCenter, (state, action) => {
      state.nearStoresCenter = action.payload;
    })
    .addCase(setSnackbar, (state, action) => {
      state.snackbar = action.payload;
    });
});

export { reducer };
