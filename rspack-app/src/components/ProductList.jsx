import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Center, Spinner } from '@chakra-ui/react';

// Lazy load the ProductListItem component
const ProductListItem = lazy(() => import('./ProductListItem'));

// ProductList component to display the list of products
const ProductList = ({
	isLoading, // Flag to indicate whether products are loading
	products, // Array of products to display
	hasNextPage, // Flag to indicate whether there are more products to load
	itemsCount, // Total number of items in the list
	loadNextPage, // Function to load the next page of products
}) => {
	// Function to determine if an item is loaded
	const isItemLoaded = (index) =>
		!hasNextPage || index < (products || []).length;

	// Render the ProductList component
	return (
		<Center
			bg='white'
			w='100%'
			h='90%'
		>
			<InfiniteLoader
				isItemLoaded={isItemLoaded}
				loadMoreItems={isLoading ? () => {} : loadNextPage}
				itemCount={itemsCount}
			>
				{({ onItemsRendered, ref }) => (
					<FixedSizeList
						ref={ref}
						itemCount={itemsCount}
						itemSize={200}
						height={600}
						width={800}
						onItemsRendered={onItemsRendered}
					>
						{({ index, style }) => {
							if (!isItemLoaded(index)) {
								// If item is not loaded, display a loading spinner
								return (
									<div style={style}>
										<Spinner size='lg' />
									</div>
								);
							}

							// Get the product at the current index
							const product = products[index];

							// Render the ProductListItem component
							return (
								<div style={style}>
									<Suspense fallback={<Spinner size='lg' />}>
										<ProductListItem product={product} />
									</Suspense>
								</div>
							);
						}}
					</FixedSizeList>
				)}
			</InfiniteLoader>
		</Center>
	);
};

// PropTypes for the ProductList component
ProductList.propTypes = {
	isLoading: PropTypes.bool.isRequired, // Flag to indicate whether products are loading
	products: PropTypes.arrayOf(PropTypes.shape({})).isRequired, // Array of products to display
	hasNextPage: PropTypes.bool.isRequired, // Flag to indicate whether there are more products to load
	itemsCount: PropTypes.number.isRequired, // Total number of items in the list
	loadNextPage: PropTypes.func.isRequired, // Function to load the next page of products
};

export default ProductList;
