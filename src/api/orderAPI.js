import { $host } from './index';

export const createOrder = async (orderData) => {
  const { data } = await $host.post('api/orders/create', orderData);
  return data;
};
