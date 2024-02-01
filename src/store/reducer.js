import { createReducer } from '@reduxjs/toolkit';

import {
  loadProducts,
  productsAreLoaded,
  addProductToCart,
  removeProductFromCart,
  increaseProductAmountInCart,
  decreaseProductAmountInCart,
  changeCartTotalCount,
  toggleProductInLovelist,
  changeCategory,
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
  productsAreLoaded: false,
  category: null,
  sortType: null,
  cartProducts: [],
  lovelistProducts: [],
  cartAmount: 0,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadProducts, (state, action) => {
      state.products = action.payload;
    })
    .addCase(productsAreLoaded, (state, action) => {
      state.products = action.payload;
    })
    .addCase(addProductToCart, (state, action) => {
      state.cartProducts = getCartWithAddedProduct(state, action);
    })
    .addCase(removeProductFromCart, (state, action) => {
      state.cartProducts = state.cartProducts.filter(
        (product) => product.id !== action.payload
      );
    })
    .addCase(increaseProductAmountInCart, (state, action) => {
      state.cartProducts = getCartWithIncreasedProduct(state, action);
    })
    .addCase(decreaseProductAmountInCart, (state, action) => {
      state.cartProducts = getCartWithDecreasedProduct(state, action);
    })
    .addCase(changeCartTotalCount, (state) => {
      let count = 0;
      state.cartProducts.map(
        (item) => (count += (item.sale || item.price) * item.quantity)
      );
      state.cartAmount = count;
    })
    .addCase(toggleProductInLovelist, (state, action) => {
      state.lovelistProducts = updateLovelist(state, action);
    })
    .addCase(changeCategory, (state, action) => {
      state.category = action.payload;
    });
});

export { reducer };
