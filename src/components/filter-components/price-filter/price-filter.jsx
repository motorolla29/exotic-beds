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
  const [rangeValue, setRangeValue] = useState([
    searchParams.get('minPrice') || 0,
    searchParams.get('maxPrice') || 100,
  ]);

  const handleRangeChange = (evt, newValue) => {
    setRangeValue(newValue);
  };

  const setValidatedPriceRangeParams = (currentValue, minValue, maxValue) => {
    let min = +minValue;
    let max = +maxValue;
    let value = +currentValue;

    if (min < 0) {
      min = 0;
    } else if (min > 100) {
      min = max;
    } else if (max < 0) {
      max = min;
    } else if (max > 100) {
      max = 100;
    } else if (value === min && value > max) {
      max = min;
    } else if (value === max && value < min) {
      min = max;
    }

    searchParams.set('minPrice', min);
    searchParams.set('maxPrice', max);
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

    if (minValue < 0) {
      setRangeValue([0, maxValue]);
    } else if (minValue > 100) {
      setRangeValue([maxValue, rangeValue[1]]);
    } else if (maxValue < 0) {
      setRangeValue([minValue, minValue]);
    } else if (maxValue > 100) {
      setRangeValue([minValue, 100]);
    } else if (value === minValue && value > maxValue) {
      setRangeValue([minValue, minValue]);
    } else if (value === maxValue && value < minValue) {
      setRangeValue([maxValue, maxValue]);
    }

    setValidatedPriceRangeParams(currentValue, rangeValue[0], rangeValue[1]);
  };

  return (
    <div className="price-filter">
      <div className="price-filter-inputs">
        <div className="price-filter-inputs_container">
          <span className="price-filter-inputs_title">From</span>
          <input
            type="number"
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
            className="price-filter-inputs_number"
          />
        </div>
        <div className="price-filter-inputs_container">
          <span className="price-filter-inputs_title">To</span>
          <input
            type="number"
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
