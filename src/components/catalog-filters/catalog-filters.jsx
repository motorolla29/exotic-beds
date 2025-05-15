import { useSearchParams } from 'react-router-dom';
import StickyBox from 'react-sticky-box';
import { useMemo } from 'react';

import CategoryFilter from '../filter-components/category-filter/category-filter';
import PriceFilter from '../filter-components/price-filter/price-filter';
import RatingFilter from '../filter-components/rating-filter/rating-filter';
import SeriesFilter from '../filter-components/series-filter/series-filter';
import FilterSwitchers from '../filter-components/filter-switchers/filter-switchers';

import './catalog-filters.sass';

const filterKeys = [
  'category',
  'series',
  'minRating',
  'minPrice',
  'maxPrice',
  'top-rated',
  'sale',
  'new',
  'q',
];

const CatalogFilters = ({
  category,
  minPrice,
  maxPrice,
  filterCounts,
  loading,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Есть ли активные фильтры
  const isFilterParams = useMemo(
    () => filterKeys.some((key) => searchParams.has(key)),
    [searchParams]
  );

  const clearFilters = () => {
    filterKeys.forEach((key) => searchParams.delete(key));
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  return loading ? (
    <div className="catalog-filters-skeleton">
      <div className="cf-skel-header catalog-filters-skeleton-shine" />
      <div className="cf-skel-filter_1">
        <div className="cf-skel-filter_1_title catalog-filters-skeleton-shine" />
        <div className="cf-skel-filter_1_body">
          <div className="cf-skel-filter_1_body_1">
            <div className="cf-skel-filter_1_body_1_1 catalog-filters-skeleton-shine" />
            <div className="cf-skel-filter_1_body_1_2 catalog-filters-skeleton-shine" />
          </div>
          <div className="cf-skel-filter_1_body_2 catalog-filters-skeleton-shine" />
        </div>
      </div>
      <div className="cf-skel-filter_2">
        <div className="cf-skel-filter_2_title catalog-filters-skeleton-shine" />
        <div className="cf-skel-filter_2_body">
          <div className="cf-skel-filter_2_body_1 catalog-filters-skeleton-shine" />
          <div className="cf-skel-filter_2_body_2 catalog-filters-skeleton-shine" />
          <div className="cf-skel-filter_2_body_3 catalog-filters-skeleton-shine" />
          <div className="cf-skel-filter_2_body_4 catalog-filters-skeleton-shine" />
          <div className="cf-skel-filter_2_body_5 catalog-filters-skeleton-shine" />
        </div>
      </div>
      <div className="cf-skel-filter_3">
        <div className="cf-skel-filter_3_title catalog-filters-skeleton-shine" />
        <div className="cf-skel-filter_3_1">
          <div className="cf-skel-filter_3_1_1 catalog-filters-skeleton-shine" />
          <div className="cf-skel-filter_3_1_2 catalog-filters-skeleton-shine" />
        </div>
        <div className="cf-skel-filter_3_2">
          <div className="cf-skel-filter_3_2_1 catalog-filters-skeleton-shine" />
          <div className="cf-skel-filter_3_2_2 catalog-filters-skeleton-shine" />
        </div>
        <div className="cf-skel-filter_3_3">
          <div className="cf-skel-filter_3_3_1 catalog-filters-skeleton-shine" />
          <div className="cf-skel-filter_3_3_2 catalog-filters-skeleton-shine" />
        </div>
      </div>
    </div>
  ) : (
    <StickyBox className="catalog-filters" offsetTop={20} offsetBottom={20}>
      <div className="catalog-filters_header">
        <h3 className="catalog-filters_header_main-title">Filter By</h3>
        {isFilterParams ? (
          <button
            onClick={clearFilters}
            className="catalog-filters_header_clear-button"
          >
            {' '}
            Clear all
          </button>
        ) : null}
      </div>
      {!category && (
        <div className="catalog-filters_filter">
          <CategoryFilter counts={filterCounts.categoryCounts} />
        </div>
      )}
      <div className="catalog-filters_filter">
        <PriceFilter minPrice={minPrice} maxPrice={maxPrice} />
      </div>
      <div className="catalog-filters_filter">
        <RatingFilter counts={filterCounts.ratingCounts} />
      </div>
      <div className="catalog-filters_filter">
        <SeriesFilter counts={filterCounts.seriesCounts} />
      </div>
      <FilterSwitchers
        newCount={filterCounts.newCount}
        saleCount={filterCounts.saleCount}
        topRatedCount={filterCounts.topRatedCount}
      />
    </StickyBox>
  );
};

export default CatalogFilters;
