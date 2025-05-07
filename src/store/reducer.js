import { createReducer } from '@reduxjs/toolkit';

import {
  setOverlayLoader,
  setIsAuth,
  setDeviceId,
  setProductsLoaded,
  setAuthProcess,
  setUser,
  setProducts,
  loadProducts,
  cartOpen,
  setCart,
  setLovelist,
  setMapViewState,
  setNearStoresCenter,
  setSnackbar,
  loginModalsOpen,
  setNotificationModal,
  setConfirmationModal,
  setAppliedPromocode,
} from './action';

const initialState = {
  overlayLoader: true,
  authProcess: true,
  isAuth: false,
  deviceId: null,
  user: {},
  products: {
    items: [],
    total: 0,
    page: 1,
    pageSize: 24,
    minPrice: 0,
    maxPrice: 0,
    filterCounts: {},
  },
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
  appliedPromocode: { name: null, status: null },
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setOverlayLoader, (state, action) => {
      state.overlayLoader = action.payload;
    })
    .addCase(setProductsLoaded, (state, action) => {
      state.productsLoaded = action.payload;
    })
    .addCase(setAuthProcess, (state, action) => {
      state.authProcess = action.payload;
    })
    .addCase(setIsAuth, (state, action) => {
      state.isAuth = action.payload;
    })
    .addCase(setDeviceId, (state, action) => {
      state.deviceId = action.payload;
    })
    .addCase(setUser, (state, action) => {
      state.user = action.payload;
    })
    .addCase(setProducts, (state, action) => {
      state.products = action.payload;
    })
    .addCase(loadProducts, (state, action) => {
      state.products = action.payload;
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
    .addCase(setLovelist, (state, action) => {
      state.lovelistProducts = action.payload.slice();
    })
    .addCase(setMapViewState, (state, action) => {
      state.mapViewState = action.payload;
    })
    .addCase(setNearStoresCenter, (state, action) => {
      state.nearStoresCenter = action.payload;
    })
    .addCase(setSnackbar, (state, action) => {
      state.snackbar = action.payload;
    })
    .addCase(setAppliedPromocode, (state, action) => {
      state.appliedPromocode = action.payload;
    });
});

export { reducer };
