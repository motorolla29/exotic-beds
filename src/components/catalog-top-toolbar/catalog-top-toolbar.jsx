import './catalog-top-toolbar.sass';

const CatalogTopToolbar = () => {
  return (
    <div className="top-toolbar">
      <div className="top-toolbar_items-counter">Items 1 - 24 of 647</div>
      <div className="top-toolbar_items-limiter">
        Items per page
        <div className="top-toolbar_items-limiter_control">
          <select className="top-toolbar_items-limiter_control_options">
            <option value="24">24</option>
            <option value="24">48</option>
            <option value="24">96</option>
          </select>
        </div>
      </div>
      <div className="top-toolbar_sorter">
        Sort By
        <select className="top-toolbar_sorter_options">
          <option>Most relevant</option>
          <option>Price - Low to high</option>
          <option>Price - High to low</option>
          <option>Top rated first</option>
          <option>New first</option>
          <option>% discount</option>
        </select>
      </div>
    </div>
  );
};

export default CatalogTopToolbar;
