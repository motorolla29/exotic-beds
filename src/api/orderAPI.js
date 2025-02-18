import { $host, $authHost } from './index';

export const createOrder = async (orderData) => {
  const { data } = await $host.post('api/orders/create', orderData);
  return data;
};

export const getOrders = async () => {
  const { data } = await $authHost('api/orders');
  return data;
};
