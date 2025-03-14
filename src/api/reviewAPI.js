import { $authHost } from './index';

export const rateReview = async (reviewId, isLike) => {
  const { data } = await $authHost.post('api/reviews/rate', {
    reviewId,
    isLike,
  });
  return data;
};

export const getReviewRating = async (reviewId) => {
  const { data } = await $authHost.get(`api/reviews/ratings/${reviewId}`);
  return data;
};
