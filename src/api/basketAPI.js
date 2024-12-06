import { $authHost } from './index';

export const getBasket = async () => {
  const { data } = await $authHost.get('api/basket');
  return data;
};

export const addToBasket = async (product) => {
  const { data } = await $authHost.post('api/basket/add', product);
  return data;
};

export const decrementBasketProduct = async (product) => {
  const { data } = await $authHost.post('api/basket/decrement', product);
  return data;
};

export const removeBasketProduct = async (product) => {
  const { data } = await $authHost.post('api/basket/remove', product);
  return data;
};