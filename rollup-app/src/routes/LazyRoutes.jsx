import { lazy } from 'react';

const ProductListPage = lazy(() => import('../pages/ProductListPage.jsx'));

const LazyRoutes = {
  ProductListPage,
};

export default LazyRoutes;
