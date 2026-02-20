import { $authHost } from './index';

export const uploadCatalogImage = async (file) => {
  const formData = new FormData();
  formData.append('photo', file);

  const { data } = await $authHost.post('/api/media/catalog', formData);
  // data: { fileName, urls: { original, md, sm } }
  return data;
};

export const deleteCatalogImage = async (fileName) => {
  if (!fileName) return;
  await $authHost.post('/api/media/catalog/delete', { fileName });
};
