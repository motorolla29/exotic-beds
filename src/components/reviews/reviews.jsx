import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PulseLoader from 'react-spinners/PulseLoader';

import Review from '../review/review';
import RatingSelector from '../rating-selector/rating-selector';
import { RATING_TEXTS } from '../../const';

import './reviews.sass';
import { loginModalsOpen } from '../../store/action';

const mockReviews = [
  {
    id: 1,
    productId: 201,
    rating: 5,
    comment: 'Excellent product! Great quality, highly recommend!',
    createdAt: '2025-01-01 22:39:08.713+03',
    user: {
      name: 'John',
      photo: '6514aaf1-934f-40fe-9a3d-7866d6d5bd37_USER_AVATAR',
    },
  },
  {
    id: 2,
    productId: 201,
    rating: 4,
    comment: 'Good product, but the packaging was slightly damaged.',
    createdAt: '2025-03-09T08:15:30Z',
    user: {
      name: 'Emma',
      photo: null,
    },
  },
  {
    id: 3,
    productId: 202,
    rating: 3,
    comment: 'Expected better quality, but decent for the price.',
    createdAt: '2025-03-08T18:45:10Z',
    user: {
      name: 'Michael',
      photo: '6514aaf1-934f-40fe-9a3d-7866d6d5bd37_USER_AVATAR',
    },
  },
  {
    id: 4,
    productId: 203,
    rating: 5,
    comment: 'Fast delivery, everything is great!',
    createdAt: '2025-03-07T14:20:05Z',
    user: {
      name: 'Sophia',
      photo: null,
    },
  },
  {
    id: 5,
    productId: 204,
    rating: 2,
    comment: 'Unfortunately, the product does not match the description.',
    createdAt: '2025-03-06T10:10:00Z',
    user: {
      name: 'James',
      photo: '6514aaf1-934f-40fe-9a3d-7866d6d5bd37_USER_AVATAR',
    },
  },
  {
    id: 6,
    productId: 205,
    rating: 4,
    comment: 'Overall satisfied, but could be better.',
    createdAt: '2025-03-05T17:05:22Z',
    user: {
      name: 'Olivia',
      photo: '6514aaf1-934f-40fe-9a3d-7866d6d5bd37_USER_AVATAR',
    },
  },
  {
    id: 7,
    productId: 206,
    rating: 5,
    comment: 'The best product in its category!',
    createdAt: '2025-03-04T21:30:12Z',
    user: {
      name: 'William',
      photo: '6514aaf1-934f-40fe-9a3d-7866d6d5bd37_USER_AVATAR',
    },
  },
  {
    id: 8,
    productId: 207,
    rating: 3,
    comment: 'Not exactly what I expected. Average quality.',
    createdAt: '2025-03-03T09:45:55Z',
    user: {
      name: 'Isabella',
      photo: null,
    },
  },
  {
    id: 9,
    productId: 208,
    rating: 1,
    comment: 'The product arrived broken, very disappointed.',
    createdAt: '2025-03-02T12:20:40Z',
    user: {
      name: 'Alexander',
      photo: '6514aaf1-934f-40fe-9a3d-7866d6d5bd37_USER_AVATAR',
    },
  },
  {
    id: 10,
    productId: 209,
    rating: 4,
    comment: 'Overall a good product, but a bit overpriced.',
    createdAt: '2025-03-01T16:55:30Z',
    user: {
      name: 'Mia',
      photo: '6514aaf1-934f-40fe-9a3d-7866d6d5bd37_USER_AVATAR',
    },
  },
];

const Reviews = () => {
  const isAuth = useSelector((state) => state.isAuth);
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  //   const [commentError, setCommentError] = useState(
  //     'You have not filled out the review.'
  //   );
  const [reviewsLimit, setReviewsLimit] = useState(5);
  const [commentError, setCommentError] = useState('');

  const onCommentChange = (e) => {
    setCommentError(null);
    setComment(e.target.value);
  };

  const onSendReviewButtonClick = () => {
    if (comment.length < 1) {
      setCommentError('You have not filled out the review.');
      return;
    }
  };

  return (
    <div className="reviews">
      <div className="reviews_title">
        Reviews<span className="reviews_title_count">{mockReviews.length}</span>
      </div>
      {isAuth ? (
        <div className="reviews_form">
          <div className="reviews_form_rating">
            <span className="reviews_form_rating_title">Rate it!</span>
            <RatingSelector
              rating={rating}
              onChange={(value) => setRating(value)}
            />
            <span className="reviews_form_rating_rate-text">
              {rating ? RATING_TEXTS[rating - 1] : ''}
            </span>
          </div>
          <div className="reviews_form_comment">
            <textarea
              rows={4}
              className={`reviews_form_comment_textarea ${
                commentError ? 'error' : ''
              }`}
              value={comment}
              onChange={onCommentChange}
              placeholder="Describe your impressions of this product..."
            />
            {commentError && (
              <span className="reviews_form_comment_textarea_error">
                {commentError}
              </span>
            )}
          </div>
          <button
            onClick={onSendReviewButtonClick}
            disabled={sending || !rating}
            className="reviews_form_send-button"
          >
            {sending ? <PulseLoader color="#e9d5be" /> : 'Send'}
          </button>
        </div>
      ) : (
        <div className="reviews_auth-req">
          <p>
            To leave a review, please{' '}
            <span onClick={() => dispatch(loginModalsOpen(true))}>sign in</span>
            .
          </p>
        </div>
      )}
      {mockReviews.length > 0 ? (
        <div className="reviews_list">
          {mockReviews
            .map((review) => <Review key={review.id} review={review} />)
            .slice(0, reviewsLimit)}
          {reviewsLimit < mockReviews.length && (
            <button
              onClick={() => {
                setReviewsLimit((prev) => prev + 5);
              }}
              className="reviews_list_show-more-button"
            >
              More Reviews
            </button>
          )}
        </div>
      ) : (
        <div className="reviews_nothing">
          <p>There are no reviews yet. Be the first!</p>
        </div>
      )}
      <div className=""></div>
    </div>
  );
};

export default Reviews;
