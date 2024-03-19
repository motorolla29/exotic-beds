import { useSearchParams } from 'react-router-dom';
import { PRODUCT_SERIES } from '../../../const';

import './series-filter.sass';

const SeriesFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="series-filter">
      <div className="series-filter_options">
        {PRODUCT_SERIES.map((series) => {
          return (
            <div key={series} className="series-filter_options_option">
              <input
                id={`series-${series}`}
                type="checkbox"
                checked={searchParams.has('series', { series })}
                onChange={(evt) => searchParams.append('series', { series })}
                className="main-checkbox series-filter_options_option_input"
              ></input>
              <label htmlFor={`series-${series}`} />
              <span className="series-filter_options_option_name">
                {series}
              </span>
              <span className="series-filter_options_option_amount">(15)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeriesFilter;
