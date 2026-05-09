import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import MuiChartsPage from './pages/MuiChartsPage.jsx';
import D3Page from './pages/D3Page.jsx';
import VisxPage from './pages/VisxPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<MuiChartsPage />} />
          <Route path="/d3" element={<D3Page />} />
          <Route path="/visx" element={<VisxPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
);
