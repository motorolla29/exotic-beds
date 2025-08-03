import { $authHost, $host } from './index';

export const getProduct = async (id) => {
  const { data } = await $host.get(`api/product/${id}`);
  return data;
};

export const getProducts = async (params) => {
  const token = localStorage.getItem('token');

  // Если токена нет — сразу гость
  if (!token) {
    const { data } = await $host.get('api/product', { params });
    return data;
  }

  // Токен есть — идём по authHost. Здесь interceptor сам обновит access
  // или пробросит 401, когда и refresh протухнет.
  try {
    const { data } = await $authHost.get('api/product', { params });
    return data;
  } catch (err) {
    // Если interceptor пробросил 401 — значит и access, и refresh не живы.
    if (err.response?.status === 401) {
      // чисто на будущее: удаляем неработающий токен
      localStorage.removeItem('token');
      // и сразу гостевой запрос
      const { data } = await $host.get('api/product', { params });
      return data;
    }
    // любая другая ошибка — просто дальше бросаем
    throw err;
  }
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
