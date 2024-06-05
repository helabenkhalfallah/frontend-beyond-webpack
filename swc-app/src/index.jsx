 
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import Router from './routes/Router';

const container = document.getElementById('vite-frontend-root');
const root = createRoot(container);

root.render(
  <ChakraProvider>
    <Router />
  </ChakraProvider>
);

