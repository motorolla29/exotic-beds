import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AnimatePresence } from 'framer-motion';

import CatalogFiltersMobile from '../catalog-filters-mobile/catalog-filters-mobile';
import useWindowSize from '../../hooks/use-window-size';

import { ReactComponent as FiltersIcon } from '../../images/ui-icons/filters-icon.svg';

import './catalog-top-toolbar.sass';

const CatalogTopToolbar = ({
  products,
  category,
  sortedProducts,
  limitedSortedProducts,
  noFilter,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') || 1;
  const [limit, setLimit] = useState(searchParams.get('limit') || 24);
  const [sort, setSort] = useState(searchParams.get('sortBy') || 'relevance');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [ww] = useWindowSize();

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    searchParams.set('limit', event.target.value);
    searchParams.set('page', 1);
    setSearchParams(searchParams);
  };
  const handleSortChange = (event) => {
    setSort(event.target.value);
    searchParams.set('sortBy', event.target.value);
    searchParams.set('page', 1);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    setLimit(searchParams.get('limit') || 24);
    setSort(searchParams.get('sortBy') || 'relevance');
  }, [searchParams]);

  return (
    <div className="top-toolbar">
      <div className="top-toolbar_counter">
        Items {(page - 1) * limit + 1} -{' '}
        {sortedProducts.length -
          (sortedProducts.length -
            (+page === Math.ceil(sortedProducts.length / limit)
              ? sortedProducts.length
              : limitedSortedProducts.length * page))}{' '}
        of {sortedProducts.length}
      </div>
      <div className="top-toolbar_panel">
        <div className="top-toolbar_panel_sorting">
          <div className="top-toolbar_panel_sorting_limiter">
            <Box className="top-toolbar_panel_sorting_limiter_box">
              <FormControl
                className="top-toolbar_panel_sorting_limiter_control"
                size="small"
              >
                <InputLabel
                  className="top-toolbar_panel_sorting_limiter_control_label"
                  id="demo-simple-select-label"
                >
                  Per Page
                </InputLabel>
                <Select
                  className="top-toolbar_panel_sorting_limiter_control_select"
                  labelId="limit-select-label"
                  id="limit-select"
                  value={limit}
                  label="Per Page"
                  onChange={handleLimitChange}
                >
                  <MenuItem value={24}>24</MenuItem>
                  <MenuItem value={48}>48</MenuItem>
                  <MenuItem value={96}>96</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
          <div className="top-toolbar_panel_sorting_sorter">
            <Box className="top-toolbar_panel_sorting_sorter_box">
              <FormControl
                className="top-toolbar_panel_sorting_sorter_control"
                size="small"
              >
                <InputLabel
                  className="top-toolbar_panel_sorting_sorter_control_label"
                  id="demo-simple-select-label"
                >
                  Sort By
                </InputLabel>
                <Select
                  className="top-toolbar_panel_sorting_sorter_control_select"
                  labelId="sort-select-label"
                  id="sort-select"
                  value={sort}
                  label="Sort By"
                  onChange={handleSortChange}
                >
                  <MenuItem value={'relevance'}>Most relevant</MenuItem>
                  <MenuItem value={'price_asc'}>Price - Low to high</MenuItem>
                  <MenuItem value={'price_desc'}>Price - High to low</MenuItem>
                  <MenuItem value={'rating'}>Top rated first</MenuItem>
                  <MenuItem value={'recent'}>New first</MenuItem>
                  <MenuItem value={'discount'}>% discount</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
        </div>
        {ww <= 768 && !noFilter ? (
          <div
            onClick={() => {
              setFiltersVisible(true);
              window.scrollTo(0, 0);
            }}
            className="top-toolbar_panel_filter"
          >
            <FiltersIcon />
          </div>
        ) : null}
      </div>
      <AnimatePresence>
        {ww <= 768 && filtersVisible ? (
          <CatalogFiltersMobile
            closeFilters={() => {
              setFiltersVisible(false);
            }}
            products={products}
            category={category}
            sortedProducts={sortedProducts}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default CatalogTopToolbar;
