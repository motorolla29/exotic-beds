import { useSearchParams } from 'react-router-dom';

import './catalog-empty.sass';

const CatalogEmpty = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const onClearFiltersButtonClickHandler = () => {
    searchParams.delete('category');
    searchParams.delete('series');
    searchParams.delete('minRating');
    searchParams.delete('minPrice');
    searchParams.delete('maxPrice');
    searchParams.delete('top-rated');
    searchParams.delete('sale');
    searchParams.delete('new');
    setSearchParams(searchParams);
  };

  return (
    <div className="catalog-empty">
      <div className="catalog-empty_description">
        Nothing was found matching your parameters. Try to reset the filters.
      </div>
      <button
        onClick={onClearFiltersButtonClickHandler}
        className="catalog-empty_clear-filters"
      >
        Clear filters
      </button>
    </div>
  );
};

export default CatalogEmpty;
