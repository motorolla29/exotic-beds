import { $authHost } from './index';

export const createOrder = async (orderData) => {
  const { data } = await $authHost.post('api/orders/create', orderData);
  return data;
};
