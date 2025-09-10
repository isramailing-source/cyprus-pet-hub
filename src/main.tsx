import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('=== MAIN.TSX START ===');

try {
  const rootElement = document.getElementById("root");
  console.log('Root element found:', rootElement);
  
  if (rootElement) {
    const root = createRoot(rootElement);
    console.log('Rendering App component...');
    root.render(<App />);
    console.log('App render initiated');
  }
} catch (error) {
  console.error('Error in main.tsx:', error);
}
