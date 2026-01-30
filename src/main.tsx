import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ProductSelector } from './components/ProductSelector';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProductSelector />
  </StrictMode>
);
