import { lazy } from 'react';

const ProductListPage = lazy(() => import('../pages/ProductListPage'));

const LazyRoutes = {
	ProductListPage,
};

export default LazyRoutes;
