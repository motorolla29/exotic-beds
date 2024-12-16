import { $host, $authHost } from './index';
import { jwtDecode } from 'jwt-decode';

export const registration = async (name, email, password) => {
  const { data } = await $host.post('api/user/registration', {
    name,
    email,
    password,
  });
  localStorage.setItem('token', data.token);
  return data.user;
};

export const login = async (email, password) => {
  const { data } = await $host.post('api/user/login', {
    email,
    password,
  });
  localStorage.setItem('token', data.token);
  return data.user;
};

export const check = async () => {
  const { data } = await $authHost.get('api/user/auth');
  localStorage.setItem('token', data.token);
  return data.user;
};

export const deleteUser = async () => {
  return await $authHost.get('api/user/delete');
};

export const setAvatar = async (formData) => {
  const { data } = await $authHost.post('api/user/avatar/set', formData);
  return data.user;
};

export const deleteAvatar = async () => {
  const { data } = await $authHost.post('api/user/avatar/delete');
  return data.user;
};
