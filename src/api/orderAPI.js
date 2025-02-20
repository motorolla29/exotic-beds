import { $host, $authHost } from './index';

export const createOrder = async (orderData) => {
  const { data } = await $host.post('api/orders/create', orderData);
  return data;
};

export const getOrders = async () => {
  const { data } = await $authHost.get('api/orders');
  return data;
};

export const getOrder = async (id) => {
  const { data } = await $authHost.get(`api/orders/${id}`);
  return data;
};
