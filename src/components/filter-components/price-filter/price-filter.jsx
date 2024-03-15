import './price-filter.sass';

const PriceFilter = () => {
  return (
    <div className="price-filter">
      <div className="price-filter_scrolling">
        <div className="price-filter_scrolling_container">
          <div className="price-filter_scrolling_container_number_container">
            <span className="price-filter_scrolling_container_number_title">
              From
            </span>
            <input
              type="number"
              min="100"
              max="100000"
              className="price-filter_scrolling_container_number"
            />
          </div>
          <div className="price-filter_scrolling_container_number_container">
            <span className="price-filter_scrolling_container_number_title">
              To
            </span>
            <input
              type="number"
              min="100"
              max="100000"
              className="price-filter_scrolling_container_number"
            />
          </div>
        </div>
        <div className="price-filter_scrolling_line">
          <button
            type="button"
            draggable="true"
            className="price-filter_scrolling_line_thumb-left"
          />
          <button
            type="button"
            draggable="true"
            className="price-filter_scrolling_line_thumb-right"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
