import { useSelector } from 'react-redux';
import { useMemo, useRef, useState } from 'react';

import Lovelist from '../../lovelist/lovelist';
import LovelistEmpty from '../../lovelist-empty/lovelist-empty';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';

import './lovelist-page.sass';
import CatalogTopToolbar from '../../catalog-top-toolbar/catalog-top-toolbar';
import CatalogPagination from '../../catalog-pagination/catalog-pagination';
import { useSearchParams } from 'react-router-dom';
import { sortProducts } from '../../../utils';

const LovelistPage = () => {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(
    searchParams.has('page') ? +searchParams.get('page') : 1
  );

  const limit = searchParams.get('limit') || 24;
  const sort = searchParams.get('sortBy');

  const lovedProducts = useSelector((state) => state.lovelistProducts);

  const displayedLovelistItems = useRef();

  useMemo(() => {
    displayedLovelistItems.current = structuredClone(lovedProducts);
    // eslint-disable-next-line
  }, []);

  const sortedProducts = sortProducts(displayedLovelistItems.current, sort);

  const limitedSortedProducts = sortedProducts.slice(
    (page - 1) * limit,
    page * limit
  );

  return (
    <>
      <Breadcrumbs />
      <div className="lovelist-page">
        <h1 className="lovelist-page_title">
          My Lovelist
          <span>
            ({lovedProducts.length} loved{' '}
            {lovedProducts.length === 1 ? 'product' : 'products'})
          </span>
        </h1>
        {sortedProducts.length ? (
          <>
            <CatalogTopToolbar
              sortedProducts={sortedProducts}
              limitedSortedProducts={limitedSortedProducts}
            />
            <CatalogPagination
              page={page}
              setPage={setPage}
              products={sortedProducts}
              limit={limit}
            />
            <Lovelist items={limitedSortedProducts} />
            <CatalogPagination
              page={page}
              setPage={setPage}
              products={sortedProducts}
              limit={limit}
            />
          </>
        ) : (
          <LovelistEmpty />
        )}
      </div>
    </>
  );
};

export default LovelistPage;
