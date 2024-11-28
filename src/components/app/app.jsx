import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from '../layout/layout';
import MainPage from '../pages/main-page/main-page';
import CatalogPage from '../pages/catalog-page/catalog-page';
import ProductPage from '../pages/product-page/product-page';
import StoreFinderPage from '../pages/store-finder-page/store-finder-page';
import LovelistPage from '../pages/lovelist-page/lovelist-page';
import NotFoundPage from '../pages/not-found-page/not-found-page';
import SearchPage from '../pages/search-page/search-page';

import './app.sass';
import StorePage from '../pages/store-page/store-page';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { check } from '../../api/userAPI';
import { setIsAuth, setOverlayLoader, setUser } from '../../store/action';
import AccountPage from '../pages/account-page/account-page';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    check()
      .then((data) => {
        dispatch(setUser(data));
        dispatch(setIsAuth(true));
      })
      .catch((err) => console.log(err.message))
      .finally(() => dispatch(setOverlayLoader(false)));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path=":id" element={<ProductPage />} />
          <Route path="beds" element={<CatalogPage category="beds" />} />
          <Route path="sofas" element={<CatalogPage category="sofas" />} />
          <Route
            path="armchairs"
            element={<CatalogPage category="armchairs" />}
          />
          <Route path="poufs" element={<CatalogPage category="poufs" />} />
          <Route path="kids" element={<CatalogPage category="kids" />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="my-lovelist" element={<LovelistPage />} />
          <Route path="store-finder" element={<StoreFinderPage />} />
          <Route path="store-finder/:id" element={<StorePage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="not-found" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
