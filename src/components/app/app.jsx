import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import Layout from '../layout/layout';
import MainPage from '../pages/main-page/main-page';
import CatalogPage from '../pages/catalog-page/catalog-page';
import ProductPage from '../pages/product-page/product-page';
import StoreFinderPage from '../pages/store-finder-page/store-finder-page';
import LovelistPage from '../pages/lovelist-page/lovelist-page';
import NotFoundPage from '../pages/not-found-page/not-found-page';
import SearchPage from '../pages/search-page/search-page';
import StorePage from '../pages/store-page/store-page';

import { check } from '../../api/userAPI';
import {
  setAuthProcess,
  setCart,
  setIsAuth,
  setLovelist,
  setOverlayLoader,
  setProducts,
  setProductsLoaded,
  setUser,
} from '../../store/action';
import AccountPage from '../pages/account-page/account-page';
import { getBasket } from '../../api/basketAPI';
import { getLovelist } from '../../api/lovelistAPI';
import { getAllProducts } from '../../api/productAPI';
import ProtectedRoute from '../../routes/ProtectedRoute';

import './app.sass';

const App = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.isAuth);
  const productsLoaded = useSelector((state) => state.productsLoaded);

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        dispatch(setProducts(data.rows));
        dispatch(setProductsLoaded(true));
      })
      .then(() => {
        dispatch(setAuthProcess(true));
        check()
          .then((user) => {
            dispatch(setUser(user));
            dispatch(setIsAuth(true));
            getBasket()
              .then((basket) => {
                dispatch(setCart(basket));
              })
              .catch((err) => console.log(err.message));
            getLovelist()
              .then((lovelist) => {
                dispatch(setLovelist(lovelist));
              })
              .catch((err) => console.log(err.message));
          })
          .catch((err) => {
            if (!isAuth) {
              dispatch(setCart(JSON.parse(localStorage.getItem('cart')) || []));
              dispatch(setLovelist([]));
            }
            console.log(err.message);
          })
          .finally(() => dispatch(setAuthProcess(false)));
      })
      .then(() => dispatch(setOverlayLoader(false)))
      .catch((err) => console.log(err.message));
  }, [isAuth, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={productsLoaded && <MainPage />} />
          <Route path=":id" element={productsLoaded && <ProductPage />} />
          <Route
            path="beds"
            element={productsLoaded && <CatalogPage category="beds" />}
          />
          <Route
            path="sofas"
            element={productsLoaded && <CatalogPage category="sofas" />}
          />
          <Route
            path="armchairs"
            element={productsLoaded && <CatalogPage category="armchairs" />}
          />
          <Route
            path="poufs"
            element={productsLoaded && <CatalogPage category="poufs" />}
          />
          <Route
            path="kids"
            element={productsLoaded && <CatalogPage category="kids" />}
          />
          <Route path="search" element={productsLoaded && <SearchPage />} />
          <Route path="my-lovelist" element={<LovelistPage />} />
          <Route path="store-finder" element={<StoreFinderPage />} />
          <Route path="store-finder/:id" element={<StorePage />} />
          <Route
            path="account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route path="not-found" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
