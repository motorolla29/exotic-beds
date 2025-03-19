import { $authHost } from './index';

export const deleteImageFromImagekit = async (
  photo,
  retries = 0,
  maxRetries = 10,
  retryDelay = 2500
) => {
  try {
    const response = await $authHost.post('/api/imagekit/delete', {
      fileName: photo,
    });

    if (response.data.success) {
      console.log(`Image ${photo} deleted successfully`);
    } else {
      console.log('Failed to delete image');
      if (retries < maxRetries) {
        console.log(`Retrying... Attempt ${retries + 1} of ${maxRetries}`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return deleteImageFromImagekit(
          photo,
          retries + 1,
          maxRetries,
          retryDelay
        ); // Рекурсивный вызов
      } else {
        throw new Error('Exceeded maximum retries');
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log(`Image ${photo} not found, retrying deletion...`);
      if (retries < maxRetries) {
        console.log(`Retrying... Attempt ${retries + 1} of ${maxRetries}`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return deleteImageFromImagekit(
          photo,
          retries + 1,
          maxRetries,
          retryDelay
        );
      } else {
        throw new Error('File not found after multiple attempts');
      }
    }
    console.error('Error deleting image:', error);
    throw error;
  }
};

export const getImagekitAuth = async () => {
  try {
    const response = await $authHost.get('/api/imagekit/auth');
    return response.data;
  } catch (error) {
    console.error('Error fetching ImageKit auth:', error);
    throw error;
  }
};
