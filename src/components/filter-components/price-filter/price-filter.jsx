import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

import './price-filter.sass';

function valuetext(value) {
  return `€${value}`;
}

const PriceFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rangeValue, setRangeValue] = useState([20, 37]);

  const handleRangeChange = (evt, newValue) => {
    setRangeValue(newValue);
  };

  const setValidatedPriceRangeParams = (minValue, maxValue) => {
    let min = +minValue;
    let max = +maxValue;

    if (min < 0) {
      min = 0;
    } else if (min > 100) {
      min = max;
    } else if (max < 0) {
      max = min;
    } else if (max > 100) {
      max = 100;
    } else if (min > max) {
      max = min;
    }

    searchParams.set('minPrice', min);
    searchParams.set('maxPrice', max);
    setSearchParams(searchParams);
  };

  const handleRangeChangeCommited = (evt, newValue) => {
    setValidatedPriceRangeParams(newValue[0], newValue[1]);
  };

  const onInputMinPriceChange = (evt) => {
    setRangeValue([evt.target.value, rangeValue[1]]);
  };

  const onInputMaxPriceChange = (evt) => {
    setRangeValue([rangeValue[0], evt.target.value]);
  };

  const handleBlur = () => {
    setRangeValue([+rangeValue[0], +rangeValue[1]]);

    if (rangeValue[0] < 0) {
      setRangeValue([0, rangeValue[1]]);
    } else if (rangeValue[0] > 100) {
      setRangeValue([rangeValue[1], rangeValue[1]]);
    } else if (rangeValue[1] < 0) {
      setRangeValue([rangeValue[0], rangeValue[0]]);
    } else if (rangeValue[1] > 100) {
      setRangeValue([rangeValue[0], 100]);
    } else if (rangeValue[0] > rangeValue[1]) {
      setRangeValue([rangeValue[0], rangeValue[0]]);
    }

    setValidatedPriceRangeParams(rangeValue[0], rangeValue[1]);
  };

  return (
    <div className="price-filter">
      <div className="price-filter-inputs">
        <div className="price-filter-inputs_container">
          <span
            className="price-filter-inputs_title"
            onClick={() => {
              console.log(rangeValue);
            }}
          >
            From
          </span>
          <input
            type="number"
            onChange={onInputMinPriceChange}
            onBlur={handleBlur}
            onKeyDown={(evt) => {
              if (evt.key === 'Enter') {
                handleBlur();
                setValidatedPriceRangeParams(evt.target.value, rangeValue[1]);
              }
            }}
            value={rangeValue[0]}
            className="price-filter-inputs_number"
          />
        </div>
        <div className="price-filter-inputs_container">
          <span className="price-filter-inputs_title">To</span>
          <input
            type="number"
            onChange={onInputMaxPriceChange}
            onBlur={handleBlur}
            onKeyDown={(evt) => {
              if (evt.key === 'Enter') {
                handleBlur();
                setValidatedPriceRangeParams(rangeValue[0], evt.target.value);
              }
            }}
            value={rangeValue[1]}
            className="price-filter-inputs_number"
          />
        </div>
      </div>
      <Box className="slider-box">
        <Slider
          className="slider"
          getAriaLabel={() => 'Price range'}
          value={rangeValue}
          onChange={handleRangeChange}
          onChangeCommitted={handleRangeChangeCommited}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
        />
      </Box>
    </div>
  );
};

export default PriceFilter;
