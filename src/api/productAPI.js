import { $authHost, $host } from './index';

export const getAllProducts = async () => {
  const { data } = await $host.get('api/product');
  return data;
};

export const createProduct = async (productData) => {
  const { data } = await $authHost.post('api/product', productData);
  return data;
};

export const updateProduct = async (id, productData) => {
  const { data } = await $authHost.put(`api/product/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await $authHost.delete(`api/product/${id}`);
  return data;
};
