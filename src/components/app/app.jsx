import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Layout from '../layout/layout';
import MainPage from '../pages/main-page/main-page';
import CatalogPage from '../pages/catalog-page/catalog-page';
import ProductPage from '../pages/product-page/product-page';
import LoginPage from '../pages/login-page/login-page';
import StoreFinderPage from '../pages/store-finder-page/store-finder-page';
import LovelistPage from '../pages/lovelist-page/lovelist-page';
import NotFoundPage from '../pages/not-found-page/not-found-page';

import './app.sass';
import { setIsCartOpen } from '../../store/action';

const App = () => {
  const dispatch = useDispatch();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path=":id" element={<ProductPage />} />
          <Route path="beds" element={<CatalogPage category="Beds" />} />
          <Route path="sofas" element={<CatalogPage category="Sofas" />} />
          <Route
            path="armchairs"
            element={<CatalogPage category="Armchairs" />}
          />
          <Route path="poofs" element={<CatalogPage category="Poofs" />} />
          <Route path="kids" element={<CatalogPage category="Kids" />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="my-lovelist" element={<LovelistPage />} />
          <Route path="store-finder" element={<StoreFinderPage />} />
          <Route path="#cart" action={() => dispatch(setIsCartOpen(true))} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
