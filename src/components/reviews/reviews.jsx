import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ClickAwayListener } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

import ErrorIcon from '@mui/icons-material/Error';
import PulseLoader from 'react-spinners/PulseLoader';

import Review from '../review/review';
import RatingSelector from '../rating-selector/rating-selector';
import { COMMENTS_SORT_OPTIONS, RATING_TEXTS } from '../../const';
import { loginModalsOpen, setNotificationModal } from '../../store/action';
import {
  createReview,
  getReviewsByProductPrivate,
  getReviewsByProductPublic,
} from '../../api/reviewAPI';

import './reviews.sass';

// const mockReviews = [
//   {
//     id: 1,
//     productId: 201,
//     rating: 5,
//     comment: 'Excellent product! Great quality, highly recommend!',
//     createdAt: '2025-01-01 22:39:08.713+03',
//     user: {
//       name: 'John',
//       photo: '6514aaf1-934f-40fe-9a3d-7866d6d5bd37_USER_AVATAR',
//     },
//     likes: 2,
//     dislikes: 1,
//   },
//   {
//     id: 3,
//     productId: 202,
//     rating: 3,
//     comment: 'Expected better quality, but decent for the price.',
//     createdAt: '2025-03-08T18:45:10Z',
//     user: {
//       name: 'Michael',
//       photo: '6514aaf1-934f-40fe-9a3d-7866d6d5bd37_USER_AVATAR',
//     },
//     likes: 0,
//     dislikes: 1,
//   },
//   {
//     id: 4,
//     productId: 203,
//     rating: 5,
//     comment: 'Fast delivery, everything is great!',
//     createdAt: '2025-03-07T14:20:05Z',
//     user: {
//       name: 'Sophia',
//       photo: null,
//     },
//     likes: 2,
//     dislikes: 11,
//   },
//   {
//     id: 5,
//     productId: 204,
//     rating: 2,
//     comment: 'Unfortunately, the product does not match the description.',
//     createdAt: '2025-03-06T10:10:00Z',
//     user: {
//       name: 'James',
//       photo: '6514aaf1-934f-40fe-9a3d-7866d6d5bd37_USER_AVATAR',
//     },
//     likes: 12,
//     dislikes: 1,
//   },
//   {
//     id: 6,
//     productId: 205,
//     rating: 4,
//     comment: 'Overall satisfied, but could be better.',
//     createdAt: '2025-03-05T17:05:22Z',
//     user: {
//       name: 'Olivia',
//       photo: '6514aaf1-934f-40fe-9a3d-7866d6d5bd37_USER_AVATAR',
//     },
//     likes: 22,
//     dislikes: 10,
//   },
//   {
//     id: 7,
//     productId: 206,
//     rating: 5,
//     comment: 'The best product in its category!',
//     createdAt: '2025-03-04T21:30:12Z',
//     user: {
//       name: 'William',
//       photo: '6514aaf1-934f-40fe-9a3d-7866d6d5bd37_USER_AVATAR',
//     },
//     likes: 3,
//     dislikes: 5,
//   },
//   {
//     id: 8,
//     productId: 207,
//     rating: 3,
//     comment: 'Not exactly what I expected. Average quality.',
//     createdAt: '2025-03-03T09:45:55Z',
//     user: {
//       name: 'Isabella',
//       photo: null,
//     },
//     likes: 20,
//     dislikes: 11,
//   },
//   {
//     id: 9,
//     productId: 208,
//     rating: 1,
//     comment: 'The product arrived broken, very disappointed.',
//     createdAt: '2025-03-02T12:20:40Z',
//     user: {
//       name: 'Alexander',
//       photo: '6514aaf1-934f-40fe-9a3d-7866d6d5bd37_USER_AVATAR',
//     },
//     likes: 4,
//     dislikes: 4,
//   },
//   {
//     id: 10,
//     productId: 209,
//     rating: 4,
//     comment: 'Overall a good product, but a bit overpriced.',
//     createdAt: '2025-03-01T16:55:30Z',
//     user: {
//       name: 'Mia',
//       photo: '6514aaf1-934f-40fe-9a3d-7866d6d5bd37_USER_AVATAR',
//     },
//     likes: 223,
//     dislikes: 111,
//   },
// ];

const Reviews = ({ product }) => {
  const isAuth = useSelector((state) => state.isAuth);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [hasUserReviewed, setHasUserReviewed] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [reviewsLimit, setReviewsLimit] = useState(5);
  const [commentError, setCommentError] = useState('');
  const [isSortCommentsSelectListOpen, setIsSortCommentsSelectListOpen] =
    useState(false);
  const [selectedCommentsSortOption, setSelectedCommentsSortOption] = useState(
    COMMENTS_SORT_OPTIONS[0]
  );

  useEffect(() => {
    if (!reviewsLoading) {
      setShowForm(!hasUserReviewed);
      setMounted(true);
    }
  }, [hasUserReviewed, reviewsLoading]);

  useEffect(() => {
    (async () => {
      setReviewsLoading(true);
      try {
        const data = isAuth
          ? await getReviewsByProductPrivate(product.id)
          : await getReviewsByProductPublic(product.id);
        setReviews(data);

        const userReview = data.find((review) => review.user.id === user.id);

        setHasUserReviewed(!!userReview);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    })();
  }, [product.id, user.id, isAuth]);

  // Функция сортировки
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (selectedCommentsSortOption.value) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'highest-rating':
        return b.rating - a.rating;
      case 'lowest-rating':
        return a.rating - b.rating;
      case 'helpful':
        return b.likes - b.dislikes - (a.likes - a.dislikes);
      default:
        return 0;
    }
  });

  const onCommentChange = (e) => {
    setCommentError(null);
    setComment(e.target.value);
  };

  const onSendReviewButtonClick = async () => {
    if (comment.length < 1) {
      setCommentError('You have not filled out the review.');
      return;
    }
    setSending(true);

    try {
      const newReview = await createReview({
        productId: product.id,
        rating,
        comment,
      });

      const formattedReview = {
        ...newReview,
        user: { name: user.name, photo: user.photo },
        likes: 0,
        dislikes: 0,
        userVote: null,
        reviewRates: [],
        new: true,
      };

      setReviews((prev) => [formattedReview, ...prev]); // Добавляем новый отзыв в начало списка
      setRating(0);
      setComment('');
      setHasUserReviewed(true);
    } catch (error) {
      dispatch(
        setNotificationModal({
          open: true,
          icon: <ErrorIcon />,
          title: 'Error creating review',
          description: 'Something went wrong, try again later',
        })
      );
      console.error('Error creating review:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="reviews">
      <div className="reviews_title">
        Reviews<span className="reviews_title_count">{reviews.length}</span>
      </div>
      {isAuth && (
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={
                mounted
                  ? {
                      opacity: 0,
                      scale: 0,
                    }
                  : { opacity: 1, scale: 1 }
              }
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0,
                maxHeight: '0px',
                marginBottom: '0em',
                padding: '0em',
                border: '0px',
              }}
              className="reviews_form"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      )}
      {!isAuth && (
        <div className="reviews_auth-req">
          <p>
            To leave a review, please{' '}
            <span onClick={() => dispatch(loginModalsOpen(true))}>sign in</span>
            .
          </p>
        </div>
      )}
      {reviews.length > 0 ? (
        <div className="reviews_list">
          <div className="reviews_list_header">
            <div className="reviews_list_header_count">
              1-
              {reviewsLimit < reviews.length
                ? reviewsLimit
                : reviews.length} of {reviews.length} reviews
            </div>
            <div className="reviews_list_header_sort">
              <ClickAwayListener
                onClickAway={() => setIsSortCommentsSelectListOpen(false)}
              >
                <div
                  className="reviews_list_header_sort_select"
                  onClick={() =>
                    setIsSortCommentsSelectListOpen(
                      !isSortCommentsSelectListOpen
                    )
                  }
                >
                  <div className="reviews_list_header_sort_select_selected">
                    {selectedCommentsSortOption.label}
                    <span
                      className={`reviews_list_header_sort_select_arrow ${
                        isSortCommentsSelectListOpen ? 'open' : ''
                      }`}
                    ></span>
                  </div>
                  {isSortCommentsSelectListOpen && (
                    <ul className="reviews_list_header_sort_select_list">
                      {COMMENTS_SORT_OPTIONS.map((option) => (
                        <li
                          key={option.value}
                          className="reviews_list_header_sort_select_item"
                          onClick={() => {
                            setSelectedCommentsSortOption(option);
                            setIsSortCommentsSelectListOpen(false);
                          }}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </ClickAwayListener>
            </div>
          </div>
          <div className="reviews_list_body">
            {sortedReviews
              .map((review) => <Review key={review.id} review={review} />)
              .slice(0, reviewsLimit)}
          </div>
          {reviewsLimit < reviews.length && (
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
