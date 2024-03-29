import { initParrotI18n } from '@cloudtower/eagle';
import React from 'react';
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom';

import App from './App';
import './i18n';
import 'antd/dist/antd.css';
import '@cloudtower/eagle/dist/style.css';

initParrotI18n();

const container = document.getElementById('root') as HTMLElement;

render(
  <React.StrictMode>
    <React.Suspense fallback="loading">
      <App />
    </React.Suspense>
  </React.StrictMode>,
  container
);
