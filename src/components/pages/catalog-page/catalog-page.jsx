import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Breadcrumbs from '../../breadcrumbs/breadcrumbs';
import Tabs from '../../tabs/tabs';
import CatalogFilters from '../../catalog-filters/catalog-filters';
import Catalog from '../../catalog/catalog';
import { categoriesIds, getUcFirstNoDashStr } from '../../../utils';
import CatalogTopToolbar from '../../catalog-top-toolbar/catalog-top-toolbar';
import CatalogPagination from '../../catalog-pagination/catalog-pagination';
import CatalogEmpty from '../../catalog-empty/catalog-empty';
import SearchPanel from '../../search-panel/search-panel';
import useWindowSize from '../../../hooks/use-window-size';
import { getProducts } from '../../../api/productAPI';
import { setProducts } from '../../../store/action';
import LogoSpinner from '../../logo-spinner/logo-spinner';

import './catalog-page.sass';

const CatalogPage = ({ category }) => {
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

  const [loading, setLoading] = useState(true);
  const catalogRef = useRef(null);
  const [catalogHeight, setCatalogHeight] = useState(0);

  const params = useMemo(
    () => ({
      categoryId: category && categoriesIds[category],
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
    [category, searchParams, pageSize]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // useLayoutEffect для предотвращения мигания кнопки добавления товара при уходе с 1 страницы каталога (админ)
  useLayoutEffect(() => {
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
        <title>
          {category ? `${getUcFirstNoDashStr(category)} Catalog` : 'Catalog'}
        </title>
      </Helmet>
      {ww <= 768 ? <SearchPanel /> : null}
      <Tabs />
      <Breadcrumbs />
      <div className="catalog-page">
        {ww > 768 ? (
          <CatalogFilters
            category={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            filterCounts={filterCounts}
          />
        ) : null}
        <div className="catalog-container">
          <h1 className="catalog-container_title">
            {getUcFirstNoDashStr(category)}
          </h1>
          {!items ? (
            <div className="catalog-page_loader">
              <div className="catalog-page_loader_logo-spinner">
                <LogoSpinner />
              </div>
            </div>
          ) : (
            <>
              {items.length > 0 ? (
                <>
                  <CatalogTopToolbar
                    total={total}
                    category={category}
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
                      className="catalog-page_loader-container"
                      style={{
                        height: catalogHeight ? catalogHeight : '100%', // высота для лоадера для избежания подскакивания стикибокса с фильтрами во время загрузки
                      }}
                    >
                      <div className="catalog-page_loader">
                        <div className="catalog-page_loader_logo-spinner">
                          <LogoSpinner />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div ref={catalogRef}>
                      <Catalog products={items} category={category} />
                    </div>
                  )}
                  <CatalogPagination
                    total={total}
                    page={page}
                    limit={pageSize}
                  />
                </>
              ) : (
                <CatalogEmpty />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CatalogPage;
