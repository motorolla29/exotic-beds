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
  isCartOpen: false,
  sortType: null,
  cartProducts: [
    {
      id: 'blabla3',
      title: 'blabla3',
      description: 'blablabla3',
      photo: '/catalog/_01a37cf5-f0cb-479d-ba27-f6e83c0d9225.jpg',
      price: 1999,
      rating: 4,
      availableQuantity: 4,
      quantityInCart: 1,
    },
    {
      id: 'blabla15',
      title: 'blabla15',
      description: 'blablabla15',
      photo: '/catalog/_0cd73490-1a81-45e3-a6b6-be6165770677.jpg',
      price: 1599,
      rating: 4.8,
      availableQuantity: 4,
      quantityInCart: 1,
    },
    {
      id: 'blabla12',
      title: 'blabla12',
      description: 'blablabla132',
      photo: '/catalog/_ef0941f7-9105-4ac4-bd7a-907e470e7099.jpg',
      price: 499,
      rating: 4.7,
      availableQuantity: 4,
      quantityInCart: 1,
    },
  ],
  lovelistProducts: [],
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
    .addCase(toggleProductInLovelist, (state, action) => {
      state.lovelistProducts = updateLovelist(state, action);
    });
});

export { reducer };
