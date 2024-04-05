import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import './catalog-pagination.sass';

const CatalogPagination = ({ products, limit, page, setPage }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (event, value) => {
    setPage(value);
    searchParams.set('page', value);
    setSearchParams(searchParams);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (page > Math.ceil(products.length / limit)) {
      setPage(1);
      searchParams.set('page', 1);
      setSearchParams(searchParams);
    } else {
      setPage(page);
    }
  }, [products, limit, page]);

  return (
    <div className="catalog-pagination">
      <Stack spacing={2}>
        <Pagination
          count={Math.ceil(products.length / limit)}
          size="large"
          variant="outlined"
          page={page}
          onChange={handleChange}
        />
      </Stack>
    </div>
  );
};

export default CatalogPagination;
