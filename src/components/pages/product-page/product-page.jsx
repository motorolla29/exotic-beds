import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import RatingStars from '../../rating-stars/rating-stars';

import './product-page.sass';

const ProductPage = () => {
  const { id } = useParams();

  const products = useSelector((state) => state.products);
  const product = products.find((it) => it.id === id);

  return (
    <>
      <Breadcrumbs product={product} />
      <div className="product-page">
        <div className="product-page_visual">
          <img
            className="product-page_image"
            alt="product_picture"
            src={product.photo}
          />
        </div>
        <div className="product-page_info">
          <div className="product-page_info_title">{product.title}</div>
          <div className="product-page_info_rating">
            <div className="product-page_info_rating_stars">
              <RatingStars id={product.id} rating={product.rating} />
            </div>

            <span className="product-page_info_rating_mark">
              {product.rating}
            </span>
          </div>

          <div className="product-page_info_description">
            {product.description}
          </div>

          {product.sale ? (
            <div className="product-page_info_price">
              <div>
                <span className="product-page_info_price_final">
                  €{product.sale}
                </span>
                <span className="product-page_info_price_first">
                  €{product.price}
                </span>
              </div>
              <span className="product-page_info_price_save">
                You Save: €{product.price - product.sale} (
                {Math.round(100 - (product.sale / product.price) * 100)}%)
              </span>
            </div>
          ) : (
            <div className="product-page_info_price">
              <span className="product-page_info_price_final">
                €{product.price}
              </span>
            </div>
          )}
          <div className="product-page_info_ui">
            <button
              className="product-page_info_ui_to-cart-button"
              title="Add to basket"
            >
              Add to basket
            </button>
            <button
              className="product-page_info_ui_lovelist-button"
              title="Add to lovelist"
            >
              <svg
                width="10%"
                height="10%"
                viewBox="0 0 676 608"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path d="M494.533 0C426.4 0 367.567 39.9 338 98.1C308.433 39.9 249.6 0 181.467 0C83.8 0 4.66663 81.9 4.66663 182.7C4.66663 283.5 65.2333 375.9 143.5 451.8C221.767 527.7 338 600 338 600C338 600 450.467 528.9 532.5 451.8C620 369.6 671.333 283.8 671.333 182.7C671.333 81.6 592.2 0 494.533 0Z" />
                  <path d="M337.554 98.3265L338 99.2039L338.446 98.3265C367.934 40.2805 426.603 0.5 494.533 0.5C591.909 0.5 670.833 81.8609 670.833 182.7C670.833 283.607 619.605 369.285 532.158 451.436L532.475 451.773L532.157 451.436C491.164 489.964 442.56 526.999 404.197 554.406C385.017 568.108 368.399 579.402 356.578 587.27C350.667 591.204 345.955 594.281 342.721 596.375C341.104 597.421 339.857 598.222 339.014 598.761C338.592 599.031 338.272 599.235 338.057 599.372L337.998 599.409L337.929 599.366C337.707 599.228 337.377 599.02 336.942 598.746C336.072 598.199 334.786 597.386 333.122 596.324C329.792 594.199 324.948 591.08 318.89 587.099C306.774 579.138 289.804 567.732 270.389 553.955C231.556 526.398 182.954 489.365 143.848 451.441C65.6181 375.577 5.16663 283.299 5.16663 182.7C5.16663 82.1603 84.0917 0.5 181.467 0.5C249.397 0.5 308.066 40.2805 337.554 98.3265Z" />
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
