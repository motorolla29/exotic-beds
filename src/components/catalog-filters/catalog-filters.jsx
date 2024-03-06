import { PRODUCT_CATEGORIES, PRODUCT_SERIES } from '../../const';

import './catalog-filters.sass';

const CatalogFilters = () => {
  return (
    <div className="catalog-filters">
      <h3 className="catalog-filters_main-title">Filter By</h3>
      <div className="catalog-filters_category">
        <h5 className="catalog-filters_category_title">Category</h5>
        <div className="catalog-filters_category_options">
          {PRODUCT_CATEGORIES.map((category) => {
            return (
              <div className="catalog-filters_category_options_option">
                <input
                  id={`category-${category}`}
                  type="checkbox"
                  className="main-checkbox catalog-filters_category_options_option_input"
                ></input>
                <label for={`category-${category}`} />
                <span className="catalog-filters_category_options_option_name">
                  {category}
                </span>
                <span className="catalog-filters_category_options_option_amount">
                  (15)
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="catalog-filters_price">
        <h5 className="catalog-filters_price_title">Price, €</h5>
        <div className="catalog-filters_price_scrolling">
          <div className="catalog-filters_price_scrolling_container">
            <div className="catalog-filters_price_scrolling_container_number_container">
              <span className="catalog-filters_price_scrolling_container_number_title">
                From
              </span>
              <input
                type="number"
                min="100"
                max="100000"
                value="100"
                className="catalog-filters_price_scrolling_container_number"
              />
            </div>
            <div className="catalog-filters_price_scrolling_container_number_container">
              <span className="catalog-filters_price_scrolling_container_number_title">
                To
              </span>
              <input
                type="number"
                min="100"
                max="100000"
                value="100000"
                className="catalog-filters_price_scrolling_container_number"
              />
            </div>
          </div>
          <div className="catalog-filters_price_scrolling_line">
            <button
              type="button"
              draggable="true"
              className="catalog-filters_price_scrolling_line_thumb-left"
            />
            <button
              type="button"
              draggable="true"
              className="catalog-filters_price_scrolling_line_thumb-right"
            />
          </div>
        </div>
      </div>
      <div className="catalog-filters_rating">
        <h5 className="catalog-filters_rating_title">Rating</h5>
        <div className="catalog-filters_rating_options"></div>
      </div>
      <div className="catalog-filters_series">
        <h5 className="catalog-filters_series_title">Series</h5>
        <div className="catalog-filters_series_options">
          {PRODUCT_SERIES.map((series) => {
            return (
              <div className="catalog-filters_series_options_option">
                <input
                  id={`series-${series}`}
                  type="checkbox"
                  className="main-checkbox catalog-filters_series_options_option_input"
                ></input>
                <label for={`series-${series}`} />
                <span className="catalog-filters_series_options_option_name">
                  {series}
                </span>
                <span className="catalog-filters_series_options_option_amount">
                  (15)
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="catalog-filters_top-rated">Top rated only</div>
      <div className="catalog-filters_sale">On sale only</div>
      <div className="catalog-filters_new">New only</div>
    </div>
  );
};

export default CatalogFilters;
