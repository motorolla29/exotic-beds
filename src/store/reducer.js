import {
  addProductToCart,
  increaseProductAmountInCart,
  decreaseProductAmountInCart,
  toggleProductInLovelist,
} from '../utils';

const initialState = {
  products: [],
  productsCategory: null,
  productsSortType: null,
  cartProducts: [],
  lovelistProducts: [],
  cartAmount: 0,
  loading: true,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PRODUCTS_REQUESTED':
      return {
        ...state,
        loading: true,
      };

    case 'PRODUCTS_LOADED':
      return {
        ...state,
        products: action.payload,
        loading: false,
      };

    case 'ADD_PRODUCT_TO_CART':
      return addProductToCart(state, action);

    case 'REMOVE_PRODUCT_FROM_CART':
      return {
        ...state,
        cartProducts: state.cartProducts.filter(
          (product) => product.id !== action.payload
        ),
      };

    case 'INCREASE_PRODUCT_AMOUNT_IN_CART':
      return increaseProductAmountInCart(state, action);

    case 'DECREASE_PRODUCT_AMOUNT_IN_CART':
      return decreaseProductAmountInCart(state, action);

    case 'CHANGE_CART_TOTAL_COUNT':
      let count = 0;
      state.cartProducts.map(
        (item) => (count += (item.sale || item.price) * item.quantity)
      );

      return {
        ...state,
        totalCount: count,
      };

    case 'TOGGLE_PRODUCT_IN_LOVELIST':
      return toggleProductInLovelist(state, action);

    default:
      return state;
  }
};

export { reducer };
