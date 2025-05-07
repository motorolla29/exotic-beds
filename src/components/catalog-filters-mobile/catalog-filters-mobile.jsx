import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { motion } from 'framer-motion';

import CategoryFilter from '../filter-components/category-filter/category-filter';
import PriceFilter from '../filter-components/price-filter/price-filter';
import RatingFilter from '../filter-components/rating-filter/rating-filter';
import SeriesFilter from '../filter-components/series-filter/series-filter';
import FilterSwitchers from '../filter-components/filter-switchers/filter-switchers';
import { scrollController } from '../../utils';

import './catalog-filters-mobile.sass';

const filterKeysMobile = [
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

const CatalogFiltersMobile = ({
  closeFilters,
  category,
  total,
  minPrice,
  maxPrice,
  filterCounts,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const isFilterParams = useMemo(
    () => filterKeysMobile.some((key) => searchParams.has(key)),
    [searchParams]
  );

  const clearFilters = () => {
    filterKeysMobile.forEach((key) => searchParams.delete(key));
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  useEffect(() => {
    scrollController.disabledScroll();
    return () => scrollController.enabledScroll();
  }, []);

  useEffect(() => {
    const onPop = () => closeFilters();
    window.addEventListener('popstate', onPop, { once: 'true' });
  }, [closeFilters]);

  return (
    <motion.div exit={{ opacity: 0 }}>
      <OverlayScrollbarsComponent className="catalog-filters-mobile">
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            damping: 8,
            stiffness: 80,
          }}
          exit={{ y: -150, opacity: 0, transition: 0 }}
        >
          <div className="catalog-filters-mobile_header">
            <h3 className="catalog-filters-mobile_header_main-title">
              Filter By
            </h3>
            {isFilterParams && (
              <button
                onClick={clearFilters}
                className="catalog-filters-mobile_header_clear-button"
              >
                Clear all
              </button>
            )}
          </div>
          {!category && <CategoryFilter counts={filterCounts.categoryCounts} />}
          <PriceFilter minPrice={minPrice} maxPrice={maxPrice} />
          <RatingFilter counts={filterCounts.ratingCounts} />
          <SeriesFilter counts={filterCounts.seriesCounts} />
          <FilterSwitchers
            newCount={filterCounts.newCount}
            saleCount={filterCounts.saleCount}
            topRatedCount={filterCounts.topRatedCount}
          />
          <div className="catalog-filters-mobile_show-products-button">
            <button onClick={closeFilters}>
              Show {total} {total === 1 ? 'product' : 'products'}
            </button>
          </div>
        </motion.div>
      </OverlayScrollbarsComponent>
    </motion.div>
  );
};

export default CatalogFiltersMobile;
