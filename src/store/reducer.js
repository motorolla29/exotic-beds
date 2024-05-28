import { createReducer } from '@reduxjs/toolkit';

import {
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
} from './action';

import {
  getCartWithAddedProduct,
  getCartWithIncreasedProduct,
  getCartWithDecreasedProduct,
  updateLovelist,
} from '../utils';

import PRODUCTS from '../mocks/products';

const initialState = {
  products: PRODUCTS,
  productsAreLoaded: true,
  isCartOpen: false,
  sortType: null,
  cartProducts: JSON.parse(localStorage.getItem('cart')) || [],
  lovelistProducts: JSON.parse(localStorage.getItem('lovelist')) || [],
  mapViewState: {
    latitude: 47.321788,
    longitude: 8.397063,
    zoom: 1.9,
  },
  nearStoresCenter: { latitude: 55.751244, longitude: 37.618423 },
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadProducts, (state, action) => {
      state.products = action.payload;
    })
    .addCase(productsAreLoaded, (state, action) => {
      state.products = action.payload;
    })
    .addCase(cartOpen, (state, action) => {
      state.isCartOpen = action.payload;
    })
    .addCase(addProductToCart, (state, action) => {
      state.cartProducts = getCartWithAddedProduct(state, action);
      localStorage.setItem('cart', JSON.stringify(state.cartProducts));
    })
    .addCase(removeProductFromCart, (state, action) => {
      state.cartProducts = state.cartProducts.filter(
        (product) => product.id !== action.payload
      );
      localStorage.setItem('cart', JSON.stringify(state.cartProducts));
    })
    .addCase(increaseProductAmountInCart, (state, action) => {
      state.cartProducts = getCartWithIncreasedProduct(state, action);
      localStorage.setItem('cart', JSON.stringify(state.cartProducts));
    })
    .addCase(decreaseProductAmountInCart, (state, action) => {
      state.cartProducts = getCartWithDecreasedProduct(state, action);
      localStorage.setItem('cart', JSON.stringify(state.cartProducts));
    })
    .addCase(toggleProductInLovelist, (state, action) => {
      state.lovelistProducts = updateLovelist(state, action);
      localStorage.setItem('lovelist', JSON.stringify(state.lovelistProducts));
    })
    .addCase(setMapViewState, (state, action) => {
      state.mapViewState = action.payload;
    })
    .addCase(setNearStoresCenter, (state, action) => {
      state.nearStoresCenter = action.payload;
    });
});

export { reducer };
