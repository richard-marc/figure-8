import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Helmet } from 'react-helmet';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Helmet>
      <title>rikko.cool</title>
      <meta name="description" content="A cool particle animation by rikko" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://rikko.cool/" />
      <meta property="og:title" content="rikko.cool" />
      <meta property="og:description" content="A cool particle animation by rikko" />
      <meta property="og:image" content="https://rikko.cool/preview.jpg" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://rikko.cool/" />
      <meta property="twitter:title" content="rikko.cool" />
      <meta property="twitter:description" content="A cool particle animation by rikko" />
      <meta property="twitter:image" content="https://rikko.cool/preview.jpg" />
    </Helmet>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
