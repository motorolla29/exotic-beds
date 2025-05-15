import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import Tabs from '../../tabs/tabs';
import CatalogFilters from '../../catalog-filters/catalog-filters';
import Catalog from '../../catalog/catalog';
import SearchEmpty from '../../search-empty/search-empty';
import CatalogTopToolbar from '../../catalog-top-toolbar/catalog-top-toolbar';
import { categoriesIds } from '../../../utils';
import CatalogPagination from '../../catalog-pagination/catalog-pagination';
import SearchPanel from '../../search-panel/search-panel';
import useWindowSize from '../../../hooks/use-window-size';
import { setProducts } from '../../../store/action';
import { getProducts } from '../../../api/productAPI';
import LogoSpinner from '../../logo-spinner/logo-spinner';

import './search-page.sass';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [ww] = useWindowSize();
  const {
    items,
    total,
    page,
    pageSize,
    minPrice,
    maxPrice,
    filterCounts = {},
  } = useSelector((state) => state.products);

  const [loading, setLoading] = useState(false);
  const catalogRef = useRef(null);
  const [catalogHeight, setCatalogHeight] = useState(0);

  const params = useMemo(
    () => ({
      q: searchParams.get('q') || '',
      categoryId: searchParams
        .getAll('category')
        .map((cat) => categoriesIds[cat.toLowerCase()]),
      page: +searchParams.get('page') || 1,
      limit: +searchParams.get('limit') || pageSize,
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      minRating: searchParams.get('minRating'),
      series: searchParams.getAll('series'),
      topRated: searchParams.get('top-rated'),
      sale: searchParams.get('sale'),
      isNew: searchParams.get('new'),
      sortBy: searchParams.get('sortBy'),
    }),
    [searchParams, pageSize]
  );

  useEffect(() => {
    if (catalogRef.current) {
      setCatalogHeight(catalogRef.current.clientHeight);
    }
    setLoading(true);
    (async () => {
      try {
        const data = await getProducts(params);
        dispatch(setProducts(data));
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch, params]);

  return (
    <>
      <Helmet>
        <title>{`${
          params.q.length ? `${params.q} - buy on Exotic Beds` : 'Search'
        }`}</title>
      </Helmet>
      {ww <= 768 ? <SearchPanel /> : null}
      <Tabs />
      <Breadcrumbs />
      <div className="search-page">
        {ww > 768 && (
          <CatalogFilters
            minPrice={minPrice}
            maxPrice={maxPrice}
            filterCounts={filterCounts}
          />
        )}
        <div className="catalog-container">
          <h1 className="catalog-container_title">
            Search results for: '{params.q}'
          </h1>
          {!items.length && loading ? (
            <div className="search-page_loader">
              <div className="search-page_loader_logo-spinner">
                <LogoSpinner />
              </div>
            </div>
          ) : (
            <>
              {items.length > 0 ? (
                <>
                  <CatalogTopToolbar
                    total={total}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    filterCounts={filterCounts}
                  />
                  <CatalogPagination
                    total={total}
                    page={page}
                    limit={pageSize}
                  />
                  {loading ? (
                    <div
                      className="search-page_loader-container"
                      style={{
                        height: catalogHeight ? catalogHeight : '100%', // высота для лоадера для избежания подскакивания стикибокса с фильтрами во время загрузки
                      }}
                    >
                      <div className="search-page_loader">
                        <div className="search-page_loader_logo-spinner">
                          <LogoSpinner />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div ref={catalogRef}>
                      <Catalog products={items} />
                    </div>
                  )}
                  <CatalogPagination
                    total={total}
                    page={page}
                    limit={pageSize}
                  />
                </>
              ) : (
                <SearchEmpty />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
