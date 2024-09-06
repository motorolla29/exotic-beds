import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { AnimatePresence, motion } from 'framer-motion';

import './price-filter.sass';

function valuetext(value) {
  return `€${value}`;
}

const PriceFilter = ({ minPrice, maxPrice }) => {
  const [open, setOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [rangeValue, setRangeValue] = useState([
    searchParams.get('minPrice') || minPrice,
    searchParams.get('maxPrice') || maxPrice,
  ]);

  useEffect(() => {
    setRangeValue([
      searchParams.get('minPrice') || minPrice,
      searchParams.get('maxPrice') || maxPrice,
    ]);
  }, [searchParams, minPrice, maxPrice]);

  const handleRangeChange = (evt, newValue) => {
    setRangeValue(newValue);
  };

  const setValidatedPriceRangeParams = (currentValue, minValue, maxValue) => {
    let min = +minValue;
    let max = +maxValue;
    let value = +currentValue;

    if (min < minPrice) {
      min = minPrice;
    } else if (min > maxPrice) {
      min = max;
    } else if (max < minPrice) {
      max = min;
    } else if (max > maxPrice) {
      max = maxPrice;
    } else if (value === min && value > max) {
      max = min;
    } else if (value === max && value < min) {
      min = max;
    }

    searchParams.set('minPrice', min);
    searchParams.set('maxPrice', max);
    searchParams.set('page', 1);
    setSearchParams(searchParams);
  };

  const handleRangeChangeCommited = (evt, newValue) => {
    setValidatedPriceRangeParams(evt.target.value, newValue[0], newValue[1]);
  };

  const onInputMinPriceChange = (evt) => {
    setRangeValue([evt.target.value, rangeValue[1]]);
  };

  const onInputMaxPriceChange = (evt) => {
    setRangeValue([rangeValue[0], evt.target.value]);
  };

  const handleBlur = (currentValue) => {
    const value = +currentValue;
    const minValue = +rangeValue[0];
    const maxValue = +rangeValue[1];

    setRangeValue([+rangeValue[0], +rangeValue[1]]);

    if (minValue < minPrice) {
      setRangeValue([minPrice, maxValue]);
    } else if (minValue > maxPrice) {
      setRangeValue([maxValue, rangeValue[1]]);
    } else if (maxValue < minPrice) {
      setRangeValue([minValue, minValue]);
    } else if (maxValue > maxPrice) {
      setRangeValue([minValue, maxPrice]);
    } else if (value === minValue && value > maxValue) {
      setRangeValue([minValue, minValue]);
    } else if (value === maxValue && value < minValue) {
      setRangeValue([maxValue, maxValue]);
    }

    setValidatedPriceRangeParams(currentValue, rangeValue[0], rangeValue[1]);
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
                  onChange={onInputMinPriceChange}
                  onBlur={(evt) => handleBlur(evt.target.value)}
                  onKeyDown={(evt) => {
                    if (evt.key === 'Enter') {
                      handleBlur(evt.target.value);
                      setValidatedPriceRangeParams(
                        evt.target.value,
                        evt.target.value,
                        rangeValue[1]
                      );
                    }
                  }}
                  value={rangeValue[0]}
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
                  onChange={onInputMaxPriceChange}
                  onBlur={(evt) => handleBlur(evt.target.value)}
                  onKeyDown={(evt) => {
                    if (evt.key === 'Enter') {
                      handleBlur(evt.target.value);
                      setValidatedPriceRangeParams(
                        evt.target.value,
                        rangeValue[0],
                        evt.target.value
                      );
                    }
                  }}
                  value={rangeValue[1]}
                  className="price-filter_inputs_input-container_number-input"
                />
              </div>
            </div>
            <Box className="slider-box">
              <Slider
                min={minPrice}
                max={maxPrice}
                className="slider"
                getAriaLabel={() => 'Price range'}
                value={rangeValue}
                onChange={handleRangeChange}
                onChangeCommitted={handleRangeChangeCommited}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
              />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PriceFilter;
