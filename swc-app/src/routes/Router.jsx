 
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Spinner } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LazyRoute from './LazyRoutes';

const queryClient = new QueryClient();

const { ProductListPage } = LazyRoute;

const Router = () => (
  <Suspense fallback={<Spinner size='lg' />}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </Suspense>
);

export default Router;
