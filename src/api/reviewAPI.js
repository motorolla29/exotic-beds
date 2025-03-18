import { $authHost, $host } from './index';

export const createReview = async (review) => {
  const { data } = await $authHost.post('api/reviews/', review);
  return data;
};

export const getReviewsByProductPublic = async (productId) => {
  const { data } = await $host.get(`api/reviews/public/${productId}`);
  return data;
};

export const getReviewsByProductPrivate = async (productId) => {
  const { data } = await $authHost.get(`api/reviews/${productId}`);
  return data;
};

export const rateReview = async (reviewId, isLike) => {
  const { data } = await $authHost.post('api/reviews/rate', {
    reviewId,
    isLike,
  });
  return data;
};

// export const getReviewRating = async (reviewId) => {
//   const { data } = await $authHost.get(`api/reviews/ratings/${reviewId}`);
//   return data;
// };
