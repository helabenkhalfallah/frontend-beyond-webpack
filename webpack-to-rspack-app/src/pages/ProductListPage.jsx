// Import necessary dependencies from React and external libraries
import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Center, Box, Heading, Input, Spinner } from '@chakra-ui/react';

// Lazy load the ProductList component
const ProductList = lazy(() => import('../components/ProductList'));

// Function to fetch products from the API
const fetchProducts = (page = 1) => {
	return axios
		.get(`https://dummyjson.com/products?skip=${page}&limit=10`)
		.then((response) => response.data);
};

// ProductListPage component to display the product list page
const ProductListPage = () => {
	// State variables for search term, page number, and product data
	const [
		searchTerm, //
		setSearchTerm, //
	] = useState('');
	const [
		page, //
		setPage, //
	] = useState(1);
	const [
		productDataSource, //
		setProductDataSource, //
	] = useState([]);

	// Use React Query's useQuery hook to fetch product data
	const { data, isLoading, refetch } = useQuery(
		{
			queryKey: ['products', page],
			queryFn: () => fetchProducts(page),
		},
		{
			refetchOnWindowFocus: false,
			enabled: false,
		}
	);

	// Trigger initial data fetch when the component mounts
	useEffect(() => {
		refetch();
	}, []);

	// Fetch more products when the page number changes
	useEffect(() => {
		refetch();
	}, [page]);

	// Update product data source when data changes
	useEffect(() => {
		setProductDataSource([
			...(productDataSource || []),
			...(data?.products || []),
		]);
	}, [data]);

	// Function to load the next page of products
	const loadNextPage = () => {
		setPage((prevPage) => prevPage + 1);
	};

	// Function to handle changes in the search term
	const handleSearchChange = useCallback((event) => {
		setSearchTerm(event.target.value);
	}, []);

	// Filter products based on the search term
	const filteredProducts = productDataSource
		? productDataSource.filter((product) =>
				product.title.toLowerCase().includes(searchTerm.toLowerCase())
		  )
		: [];

	// Calculate the number of items in the list
	const hasNextPage = data ? page < data.total : false;
	const itemsCount =
		(hasNextPage && filteredProducts && filteredProducts?.length
			? filteredProducts.length + 1
			: filteredProducts?.length) || 0;

	// Render the ProductList component with necessary props
	return (
		<Suspense fallback={<Spinner size='lg' />}>
			<Box>
				{/* Display the heading */}
				<Center
					bg='white'
					w='100%'
					mt='5'
				>
					<Heading as='h1'>Product List</Heading>
				</Center>
				{/* Display the search input */}
				<Center
					bg='white'
					w='100%'
					mt='5'
					mb='5'
				>
					<Input
						w='750px'
						placeholder='Search products...'
						value={searchTerm}
						onChange={handleSearchChange}
					/>
				</Center>
				{/* Render the ProductList component if items are available */}
				{itemsCount > 0 && (
					<ProductList
						isLoading={isLoading}
						products={filteredProducts}
						hasNextPage={hasNextPage}
						itemsCount={itemsCount}
						loadNextPage={loadNextPage}
					/>
				)}
			</Box>
		</Suspense>
	);
};

// Export the ProductListPage component as default
export default ProductListPage;
