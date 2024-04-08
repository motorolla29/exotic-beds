import { useSearchParams } from 'react-router-dom';
import { PRODUCT_SERIES } from '../../../const';

import './series-filter.sass';

const SeriesFilter = ({ products }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="series-filter">
      <div className="series-filter_options">
        {PRODUCT_SERIES.map((series) => {
          const count = products.filter((it) =>
            it.title.toLowerCase().includes(`${series.toLowerCase()} series`)
          ).length;

          return (
            <div key={series}>
              {count ? (
                <div className="series-filter_options_option">
                  <input
                    id={`series-${series}`}
                    type="checkbox"
                    name={series}
                    checked={searchParams.has('series', `${series}`)}
                    onChange={(evt) => {
                      searchParams.has('series', `${series}`)
                        ? searchParams.delete('series', `${evt.target.name}`)
                        : searchParams.append('series', `${evt.target.name}`);
                      setSearchParams(searchParams);
                    }}
                    className="main-checkbox series-filter_options_option_input"
                  ></input>
                  <label htmlFor={`series-${series}`} />
                  <span className="series-filter_options_option_name">
                    {series}
                  </span>
                  <span className="series-filter_options_option_amount">
                    ({count})
                  </span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeriesFilter;
