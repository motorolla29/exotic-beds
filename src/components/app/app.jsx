import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';

import Layout from '../layout/layout';
import MainPage from '../pages/main-page/main-page';
import CatalogPage from '../pages/catalog-page/catalog-page';
import ProductPage from '../pages/product-page/product-page';
import StoreFinderPage from '../pages/store-finder-page/store-finder-page';
import LovelistPage from '../pages/lovelist-page/lovelist-page';
import NotFoundPage from '../pages/not-found-page/not-found-page';
import SearchPage from '../pages/search-page/search-page';
import StorePage from '../pages/store-page/store-page';
import OrderPage from '../pages/order-page/order-page';
import ErrorIcon from '@mui/icons-material/Error';

import { checkAuth } from '../../api/userAPI';
import {
  setAuthProcess,
  setCart,
  setDeviceId,
  setIsAuth,
  setLovelist,
  setNotificationModal,
  setOverlayLoader,
  setUser,
} from '../../store/action';
import AccountPage from '../pages/account-page/account-page';
import { getBasket, syncGuestCart } from '../../api/basketAPI';
import { getLovelist } from '../../api/lovelistAPI';
import ProtectedRoute from '../../routes/ProtectedRoute';
import { generateDeviceIdWithUserAgentAndClientHints } from '../../utils';
import CheckoutPage from '../pages/checkout-page/checkout-page';
import PaymentSuccessPage from '../pages/payment-success-page/payment-success-page';
import OrdersPage from '../pages/orders-page/orders-page';
import ProfilePage from '../pages/profile-page/profile-page';

import './app.sass';

const App = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.isAuth);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return; // Предотвращение повторного выполнения
    isInitialized.current = true;

    // Инициализация приложения
    const initApp = async () => {
      try {
        // 1. deviceId
        let storedDeviceId = localStorage.getItem('deviceId');
        if (!storedDeviceId) {
          storedDeviceId = await generateDeviceIdWithUserAgentAndClientHints();
          localStorage.setItem('deviceId', storedDeviceId);
        }
        dispatch(setDeviceId(storedDeviceId));

        // 2. auth
        const token = localStorage.getItem('token');

        let user = null;
        if (token) {
          try {
            user = await checkAuth();
          } catch (e) {
            user = null;
          }
        }
        dispatch(setAuthProcess(false));
        if (user) {
          dispatch(setUser(user));
          dispatch(setIsAuth(true));
        } else {
          dispatch(setIsAuth(false));
        }

        // 3. basket and lovelist
        let localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        let basket = [];
        if (user) {
          basket = await getBasket();
          dispatch(setCart(basket));
        } else {
          dispatch(setCart(localCart));
        }
        const lovelistItems = user ? await getLovelist() : [];
        dispatch(setLovelist(lovelistItems));

        // 4. sync availability for guest cart
        if (!user) {
          const adjustedCart = await syncGuestCart(localCart);
          dispatch(setCart(adjustedCart));
          localStorage.setItem('cart', JSON.stringify(adjustedCart));
        }
      } catch (error) {
        dispatch(
          setNotificationModal({
            open: true,
            icon: <ErrorIcon />,
            title: 'Initialization failed, please try again later.',
            description: error.message,
          })
        );
      } finally {
        dispatch(setOverlayLoader(false));
      }
    };

    initApp();
  }, [isAuth, dispatch]);

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
          <Route
            path="account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProfilePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderPage />} />
          </Route>
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="not-found" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
