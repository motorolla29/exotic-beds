import { $host, $authHost } from './index';
import axios from 'axios';

export const registration = async (name, email, password, deviceId) => {
  const { data } = await $authHost.post('api/user/registration', {
    name,
    email,
    password,
    deviceId,
  });
  localStorage.setItem('token', data.accessToken);
  return data.user;
};

export const login = async (email, password, deviceId) => {
  const { data } = await $authHost.post('api/user/login', {
    email,
    password,
    deviceId,
  });
  localStorage.setItem('token', data.accessToken);
  return data.user;
};

export const logout = async () => {
  const { data } = await $authHost.post('api/user/logout');
  localStorage.removeItem('token');
  return data.user;
};

export const checkAuth = async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/user/refresh`,
    {
      withCredentials: true,
      headers: {
        deviceId: localStorage.getItem('deviceId') || 'unknown_device',
      },
    }
  );
  localStorage.setItem('token', data.accessToken);
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

export const resendActivationMail = async (email) => {
  const { data } = await $host.post('api/user/resend-activation', { email });
  return data.message;
};

export const updatePersonalData = async (userData) => {
  const { data } = await $authHost.post(
    'api/user/update-personal-data',
    userData
  );
  return data.user;
};

export const updateContactData = async (userData) => {
  const { data } = await $authHost.post(
    'api/user/update-contact-data',
    userData
  );
  return data.user;
};

export const sendPasswordResetCode = async (data) => {
  const response = await $host.post('api/user/send-password-reset-code', data);
  return response.data;
};

export const verifyPasswordResetCode = async (data) => {
  const response = await $host.post(
    'api/user/verify-password-reset-code',
    data
  );
  return response.data;
};

export const updatePassword = async (data) => {
  const response = await $host.post('api/user/update-password', data);
  return response.data;
};
