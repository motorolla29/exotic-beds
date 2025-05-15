import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useSearchParams } from 'react-router-dom';

import './catalog-pagination.sass';

const CatalogPagination = ({ total, limit, loading }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pagesCount = Math.ceil(total / limit);

  const pageParam = +searchParams.get('page') || 1;
  const handleChange = (_, value) => {
    searchParams.set('page', value);
    setSearchParams(searchParams);
    window.scrollTo(0, 0);
  };

  return (
    <div className="catalog-pagination">
      <Stack spacing={2}>
        <Pagination
          count={pagesCount}
          page={pageParam}
          onChange={handleChange}
          hidePrevButton
          hideNextButton
          size="large"
          variant="outlined"
          disabled={loading}
        />
      </Stack>
    </div>
  );
};

export default CatalogPagination;
