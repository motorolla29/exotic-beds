import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useSearchParams } from 'react-router-dom';

import './catalog-pagination.sass';

const CatalogPagination = ({ products, limit }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (event, value) => {
    searchParams.set('page', value);
    setSearchParams(searchParams);
    window.scrollTo(0, 0);
  };

  return (
    <div className="catalog-pagination">
      <Stack spacing={2}>
        <Pagination
          key={products}
          count={Math.ceil(products.length / limit)}
          size="large"
          variant="outlined"
          page={+searchParams.get('page') || 1}
          onChange={handleChange}
        />
      </Stack>
    </div>
  );
};

export default CatalogPagination;
