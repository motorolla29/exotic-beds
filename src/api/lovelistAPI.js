import { $authHost } from './index';

export const getLovelist = async () => {
  const { data } = await $authHost.get('api/lovelist');
  return data;
};

export const toggleProductInLovelist = async (product) => {
  const { data } = await $authHost.post('api/lovelist/toggle', product);
  return data;
};
