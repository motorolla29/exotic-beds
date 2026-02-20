import { $authHost } from './index';

// Удаление изображений каталога из cloud.ru с ретраями.
// Использует backend-роут `/api/cloud/delete` (cloudRouter),
// который удаляет оригинал + md__/sm__ варианты.
export const deleteImageFromCloud = async (
  photo,
  retries = 0,
  maxRetries = 10,
  retryDelay = 2500,
) => {
  try {
    const response = await $authHost.post('/api/cloud/delete', {
      fileName: photo,
    });

    if (response.data.success) {
      // eslint-disable-next-line no-console
      console.log(`Image ${photo} deleted successfully`);
    } else {
      // eslint-disable-next-line no-console
      console.log('Failed to delete image');
      if (retries < maxRetries) {
        // eslint-disable-next-line no-console
        console.log(`Retrying... Attempt ${retries + 1} of ${maxRetries}`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return deleteImageFromCloud(
          photo,
          retries + 1,
          maxRetries,
          retryDelay,
        );
      }
      throw new Error('Exceeded maximum retries');
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // eslint-disable-next-line no-console
      console.log(`Image ${photo} not found, retrying deletion...`);
      if (retries < maxRetries) {
        // eslint-disable-next-line no-console
        console.log(`Retrying... Attempt ${retries + 1} of ${maxRetries}`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return deleteImageFromCloud(
          photo,
          retries + 1,
          maxRetries,
          retryDelay,
        );
      }
      throw new Error('File not found after multiple attempts');
    }
    // eslint-disable-next-line no-console
    console.error('Error deleting image from cloud:', error);
    throw error;
  }
};

