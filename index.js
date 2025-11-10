import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importă stilurile
import App from './App'; // Importă componenta principală

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
