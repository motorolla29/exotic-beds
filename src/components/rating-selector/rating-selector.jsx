//import { useState } from 'react';

const RatingSelector = ({ id = 0, rating = 0, maskColor, onChange }) => {
  //const [hoverRating, setHoverRating] = useState(null);
  //const displayedRating = hoverRating !== null ? hoverRating : rating;

  //const handleMouseEnter = (index) => setHoverRating(index + 1);
  //const handleMouseLeave = () => setHoverRating(null);

  return (
    <svg width="10%" height="10%" viewBox="0 0 160 32">
      <defs>
        <mask id={id}>
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <rect
            //x={`${displayedRating * 20}%`}
            x={`${rating * 20}%`}
            y="0"
            width="100%"
            height="100%"
            fill={maskColor || '#303030'}
          />
        </mask>
        <symbol viewBox="0 0 32 32" id="star">
          <path d="M31.547 12a.848.848 0 00-.677-.577l-9.427-1.376-4.224-8.532a.847.847 0 00-1.516 0l-4.218 8.534-9.427 1.355a.847.847 0 00-.467 1.467l6.823 6.664-1.612 9.375a.847.847 0 001.23.893l8.428-4.434 8.432 4.432a.847.847 0 001.229-.894l-1.615-9.373 6.822-6.665a.845.845 0 00.214-.869z" />
        </symbol>
        <symbol viewBox="0 0 160 32" id="stars">
          <use xlinkHref="#star" x="-64" y="0"></use>
          <use xlinkHref="#star" x="-32" y="0"></use>
          <use xlinkHref="#star" x="0" y="0"></use>
          <use xlinkHref="#star" x="32" y="0"></use>
          <use xlinkHref="#star" x="64" y="0"></use>
        </symbol>
      </defs>
      <use
        xlinkHref="#stars"
        fill="#ffe25e"
        stroke="#4F4A57"
        mask={`url(#${id})`}
      />
      {[...Array(5)].map((_, index) => (
        <rect
          key={index}
          x={index * 32}
          y="0"
          width="32"
          height="32"
          fill="transparent"
          style={{ cursor: 'pointer' }}
          //onMouseEnter={() => setHoverRating(index + 1)}
          //onMouseLeave={() => setHoverRating(null)}
          onClick={() => onChange(index + 1)}
        />
      ))}
    </svg>
  );
};

export default RatingSelector;
