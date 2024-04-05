import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useSearchParams } from 'react-router-dom';

const CatalogPagination = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (event, value) => {
    searchParams.set('page', value);
    setSearchParams(searchParams);
  };

  return (
    <Stack spacing={2}>
      <Pagination
        count={10}
        page={searchParams.get('page' || 1)}
        onChange={handleChange}
      />
    </Stack>
  );
};

export default CatalogPagination;
