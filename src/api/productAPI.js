import { $host } from './index';

export const getAllProducts = async () => {
  const { data } = await $host.get('api/product');
  return data;
};

export const createProduct = async (productData) => {
  const { data } = await $host.post('api/product', productData);
  return data;
};

export const updateProduct = async (id, productData) => {
  const { data } = await $host.put(`api/product/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await $host.delete(`api/product/${id}`);
  return data;
};
