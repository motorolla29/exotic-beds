import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from '../layout/layout';
import MainPage from '../pages/main-page/main-page';
import CatalogPage from '../pages/catalog-page/catalog-page';
import ProductPage from '../pages/product-page/product-page';
import CartPage from '../pages/cart-page/cart-page';
import LoginPage from '../pages/login-page/login-page';
import StoreFinderPage from '../pages/store-finder-page/store-finder-page';
import LovelistPage from '../pages/lovelist-page/lovelist-page';
import NotFoundPage from '../pages/not-found-page/not-found-page';

import './app.sass';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="beds" element={<CatalogPage category="beds" />} />
          <Route path="beds/:id" element={<ProductPage />} />
          <Route path="sofas" element={<CatalogPage category="sofas" />} />
          <Route path="sofas/:id" element={<ProductPage />} />
          <Route
            path="armchairs"
            element={<CatalogPage category="armchairs" />}
          />
          <Route path="armchairs/:id" element={<ProductPage />} />
          <Route path="poofs" element={<CatalogPage category="poofs" />} />
          <Route path="poofs/:id" element={<ProductPage />} />
          <Route path="kids" element={<CatalogPage category="kids" />} />
          <Route path="kids/:id" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="my-lovelist" element={<LovelistPage />} />
          <Route path="store-finder" element={<StoreFinderPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
