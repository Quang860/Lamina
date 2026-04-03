import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import TestAI from './TestAI';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestAI />
  </StrictMode>,
);
