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
  const [rawInput, setRawInput] = useState([
    String(minPrice),
    String(maxPrice),
  ]);

  useEffect(() => {
    const newRange = [
      +searchParams.get('minPrice') || minPrice,
      +searchParams.get('maxPrice') || maxPrice,
    ];
    setRangeValue(newRange);
    setRawInput([String(newRange[0]), String(newRange[1])]);
  }, [searchParams, minPrice, maxPrice]);

  const handleRangeChange = (_, newValue) => {
    setRangeValue(newValue);
    setRawInput([String(newValue[0]), String(newValue[1])]);
  };

  const validateRange = ([minVal, maxVal]) => {
    let min = Math.max(minPrice, Math.min(maxPrice, +minVal));
    let max = Math.max(minPrice, Math.min(maxPrice, +maxVal));
    if (min > max) [min, max] = [max, min];
    return [min, max];
  };

  const commitRangeChange = (_, newValue) => {
    const [min, max] = validateRange(newValue);
    setRangeValue([min, max]);
    setRawInput([String(min), String(max)]);
    searchParams.set('minPrice', min);
    searchParams.set('maxPrice', max);
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const handleBlur = (input) => {
    const [minRaw, maxRaw] = input;
    const minParsed = parseInt(minRaw || '0', 10);
    const maxParsed = parseInt(maxRaw || '0', 10);
    const [min, max] = validateRange([minParsed, maxParsed]);
    setRangeValue([min, max]);
    setRawInput([String(min), String(max)]);
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
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={rawInput[0]}
                  onChange={(e) => setRawInput([e.target.value, rawInput[1]])}
                  onBlur={() => handleBlur([rawInput[0], rawInput[1]])}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.target.blur();
                      handleBlur([rawInput[0], rawInput[1]]);
                    }
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
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={rawInput[1]}
                  onChange={(e) => setRawInput([rawInput[0], e.target.value])}
                  onBlur={() => handleBlur([rawInput[0], rawInput[1]])}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.target.blur();
                      handleBlur([rawInput[0], rawInput[1]]);
                    }
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
