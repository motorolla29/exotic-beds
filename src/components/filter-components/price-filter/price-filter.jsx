import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { AnimatePresence, motion } from 'framer-motion';

import './price-filter.sass';

function valuetext(value) {
  return `€${value}`;
}

const PriceFilter = ({ minPrice = 0, maxPrice = 99999 }) => {
  const [open, setOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [rangeValue, setRangeValue] = useState([minPrice, maxPrice]);

  useEffect(() => {
    setRangeValue([
      +searchParams.get('minPrice') || minPrice,
      +searchParams.get('maxPrice') || maxPrice,
    ]);
  }, [searchParams, minPrice, maxPrice]);

  const handleRangeChange = (_, newValue) => {
    setRangeValue(newValue);
  };

  const validateRange = ([minVal, maxVal]) => {
    let min = Math.max(minPrice, Math.min(maxPrice, +minVal));
    let max = Math.max(minPrice, Math.min(maxPrice, +maxVal));
    if (min > max) [min, max] = [max, min];
    return [min, max];
  };

  const commitRangeChange = (_, newValue) => {
    const [min, max] = validateRange(newValue);
    searchParams.set('minPrice', min);
    searchParams.set('maxPrice', max);
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const handleBlur = () => {
    const [min, max] = validateRange(rangeValue);
    setRangeValue([min, max]);
    searchParams.set('minPrice', min);
    searchParams.set('maxPrice', max);
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  return (
    <div className="price-filter">
      <h5
        onClick={() => setOpen(!open)}
        className={`price-filter_title ${open ? 'open' : 'hidden'}`}
      >
        Price, €
      </h5>
      <AnimatePresence>
        {open && (
          <motion.div
            style={{ overflow: 'hidden' }}
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
          >
            <div className="price-filter_inputs">
              <div className="price-filter_inputs_input-container">
                <span className="price-filter_inputs_input-container_title">
                  From
                </span>
                <input
                  type="number"
                  min={minPrice}
                  value={rangeValue[0]}
                  onChange={(e) =>
                    setRangeValue([+e.target.value, rangeValue[1]])
                  }
                  onBlur={handleBlur}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleBlur();
                  }}
                  className="price-filter_inputs_input-container_number-input"
                />
              </div>
              <div className="price-filter_inputs_input-container">
                <span className="price-filter_inputs_input-container_title">
                  To
                </span>
                <input
                  type="number"
                  max={maxPrice}
                  value={rangeValue[1]}
                  onChange={(e) =>
                    setRangeValue([rangeValue[0], +e.target.value])
                  }
                  onBlur={handleBlur}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleBlur();
                  }}
                  className="price-filter_inputs_input-container_number-input"
                />
              </div>
            </div>
            <Box className="slider-box">
              <Slider
                min={minPrice}
                max={maxPrice}
                value={rangeValue}
                onChange={handleRangeChange}
                onChangeCommitted={commitRangeChange}
                getAriaLabel={() => 'Price range'}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                className="slider"
              />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PriceFilter;
