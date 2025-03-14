import dayjs from 'dayjs';

import RatingStars from '../rating-stars/rating-stars';
import { FiThumbsDown, FiThumbsUp } from 'react-icons/fi';

import './review.sass';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getReviewRating, rateReview } from '../../api/reviewAPI';
import { loginModalsOpen } from '../../store/action';

const Review = ({ review }) => {
  const user = useSelector((state) => state.user);
  const isAuth = useSelector((state) => state.isAuth);
  const dispatch = useDispatch();
  const [votes, setVotes] = useState({ up: 0, down: 0 });
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getReviewRating(review.id);
        setVotes({ up: data.likes, down: data.dislikes });
        setUserVote(data.userVote);
      } catch (error) {
        console.error('Error fetching review ratings:', error);
      }
    })();
  }, [review.id]);

  const handleVote = async (isLike) => {
    if (!isAuth) {
      return dispatch(loginModalsOpen(true));
    }
    if (userVote !== null) return;

    try {
      await rateReview(review.id, isLike);
      setVotes((prev) => ({
        up: prev.up + (isLike ? 1 : 0),
        down: prev.down + (!isLike ? 1 : 0),
      }));
      setUserVote(true);
    } catch (error) {
      console.error('Error rating review:', error);
    }
  };

  return (
    <div className="review">
      <div className="review_top">
        <div className="review_top_user">
          <div className="review_top_user_avatar">
            <img
              alt="user_avatar"
              src={
                review.user.photo
                  ? `https://res.cloudinary.com/ddprwf1qr/image/upload/f_auto,q_auto,w_150/user-avatars/${review.user.photo}`
                  : 'https://res.cloudinary.com/ddprwf1qr/image/upload/f_auto,q_auto,w_150/default-avatar.jpg'
              }
            />
          </div>
          <div className="review_top_user_info">
            <p className="review_top_user_info_name">{review.user.name}</p>
            <p className="review_top_user_info_date">
              {dayjs(review.createdAt).format('D MMMM YYYY, HH:mm')}
            </p>
          </div>
        </div>
        <div className="review_top_rating">
          <RatingStars id={review.id} rating={review.rating} />
        </div>
      </div>
      <div className="review_comment">{review.comment}</div>
      <div className={`review_rates ${userVote ? 'checked' : ''}`}>
        <div
          onClick={() => handleVote(true)}
          className={`review_rates_up ${userVote === true ? 'checked' : ''}`}
        >
          <FiThumbsUp />
          <span className="review_rates_up_count">{votes.up}</span>
        </div>
        <div className="review_rates_separator" />
        <div
          onClick={() => handleVote(false)}
          className={`review_rates_down ${userVote === false ? 'checked' : ''}`}
        >
          <FiThumbsDown />
          <span className="review_rates_down_count">{votes.down}</span>
        </div>
      </div>
    </div>
  );
};

export default Review;
