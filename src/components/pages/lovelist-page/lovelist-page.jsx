import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Lovelist from '../../lovelist/lovelist';
import LovelistEmpty from '../../lovelist-empty/lovelist-empty';
import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import CatalogTopToolbar from '../../catalog-top-toolbar/catalog-top-toolbar';
import CatalogPagination from '../../catalog-pagination/catalog-pagination';

import { sortProducts } from '../../../utils';
import { loginModalsOpen } from '../../../store/action';

import './lovelist-page.sass';

const LovelistPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.isAuth);
  const [displayedLovelistItems, setDisplayedLovelistItems] = useState([]);

  const page = +searchParams.get('page') || 1;
  const limit = +searchParams.get('limit') || 24;
  const sort = searchParams.get('sortBy');

  const lovedProducts = useSelector((state) => state.lovelistProducts);

  useMemo(() => {
    if (!displayedLovelistItems.length) {
      setDisplayedLovelistItems(structuredClone(lovedProducts));
    }
    // eslint-disable-next-line
  }, [lovedProducts]);

  const sortedProducts = sortProducts(displayedLovelistItems, sort);

  const limitedSortedProducts = sortedProducts.slice(
    ((+searchParams.get('page') || 1) - 1) * limit,
    (+searchParams.get('page') || 1) * limit
  );

  return (
    <>
      <Helmet>
        <title>My Lovelist</title>
      </Helmet>
      <Breadcrumbs />
      <div className="lovelist-page">
        {isAuth ? (
          <>
            <h1 className="lovelist-page_title">
              My Lovelist
              <span>
                ({lovedProducts.length} loved{' '}
                {lovedProducts.length === 1 ? 'product' : 'products'})
              </span>
            </h1>
            {sortedProducts.length ? (
              <>
                <CatalogTopToolbar total={lovedProducts.length} noFilter />
                {sortedProducts.length > 24 && (
                  <CatalogPagination
                    total={lovedProducts.length}
                    page={page}
                    limit={limit}
                  />
                )}
                <Lovelist items={limitedSortedProducts} />
                {sortedProducts.length > 24 && (
                  <CatalogPagination
                    total={lovedProducts.length}
                    page={page}
                    limit={limit}
                  />
                )}
              </>
            ) : (
              <LovelistEmpty />
            )}
          </>
        ) : (
          <div className="lovelist-page_lovelist-authorization-required">
            <h2 className="lovelist-page_lovelist-authorization-required_title">
              Authorization required
            </h2>
            <div className="lovelist-page_lovelist-authorization-required_subtitle">
              Sign in or register to add products to your lovelist
            </div>
            <button
              className="lovelist-page_lovelist-authorization-required_button"
              onClick={() => dispatch(loginModalsOpen(true))}
            >
              Sign in
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default LovelistPage;
