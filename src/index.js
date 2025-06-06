import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { store } from './store';
import App from './components/app/app';

import '@fontsource/inter';
import './index.sass';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <Helmet>
          <title>Exotic Beds</title>
        </Helmet>
        <App />
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);
