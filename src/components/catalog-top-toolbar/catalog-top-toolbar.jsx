import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import './catalog-top-toolbar.sass';
import { useState } from 'react';

const CatalogTopToolbar = () => {
  const [limit, setLimit] = useState(24);
  const [sort, setSort] = useState('relevance');

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };
  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  return (
    <div className="top-toolbar">
      <div className="top-toolbar_counter">Items 1 - 24 of 647</div>
      <div className="top-toolbar_limiter">
        <Box className="top-toolbar_limiter_box">
          <FormControl className="top-toolbar_limiter_control" size="small">
            <InputLabel
              className="top-toolbar_limiter_control_label"
              id="demo-simple-select-label"
            >
              Per Page
            </InputLabel>
            <Select
              className="top-toolbar_limiter_control_select"
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
      <div className="top-toolbar_sorter">
        <Box className="top-toolbar_sorter_box">
          <FormControl className="top-toolbar_sorter_control" size="small">
            <InputLabel
              className="top-toolbar_sorter_control_label"
              id="demo-simple-select-label"
            >
              Sort By
            </InputLabel>
            <Select
              className="top-toolbar_sorter_control_select"
              labelId="sort-select-label"
              id="sort-select"
              value={sort}
              label="Sort By"
              onChange={handleSortChange}
            >
              <MenuItem value={'relevance'}>Most relevant</MenuItem>
              <MenuItem value={'price-asc'}>Price - Low to high</MenuItem>
              <MenuItem value={'price-desc'}>Price - High to low</MenuItem>
              <MenuItem value={'rating'}>Top rated first</MenuItem>
              <MenuItem value={'new'}>New first</MenuItem>
              <MenuItem value={'discount'}>% discount</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
    </div>
  );
};

export default CatalogTopToolbar;
