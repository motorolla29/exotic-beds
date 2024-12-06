import { $host } from './index';

export const getAllProducts = async () => {
  const { data } = await $host.get('api/product');
  return data;
};
