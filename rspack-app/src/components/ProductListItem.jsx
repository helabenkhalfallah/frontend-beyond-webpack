// Import necessary dependencies from React and external libraries
import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { LazyLoadImage } from 'react-lazy-load-image-component'; // Import LazyLoadImage component
import { Box, Heading, Text, Stack } from '@chakra-ui/react'; // Import Box, Heading, Text, and Stack components from Chakra UI

// ProductListItem component to display individual product items
const ProductListItem = ({ product }) => (
	// Box component to contain the product item
	<Box
		p={5}
		width='780px'
		h='180px'
		shadow='sm'
		borderWidth='1px'
	>
		{/* Heading component to display the product title */}
		<Heading as='h2'>{product.title}</Heading>
		{/* Stack component to arrange child components in a horizontal row */}
		<Stack direction='row'>
			{/* LazyLoadImage component to display the product thumbnail */}
			<LazyLoadImage
				alt='Product Thumbnail' // Alt text for the image
				width={150} // Width of the image
				height={150} // Height of the image
				// Placeholder element displayed while the image is loading
				placeholder={
					<Box
						bg='gray'
						w='150px'
						h='150px'
					/>
				}
				src={product.thumbnail} // Source URL of the image
				style={{
					aspectRatio: '16 / 9', // Aspect ratio of the image
					objectFit: 'scale-down', // Fit the image within the specified dimensions
				}}
			/>
			{/* Box component to contain product description and price */}
			<Box mr='md'>
				{/* Text component to display product description with truncation */}
				<Text
					noOfLines={1}
					mt={2}
				>
					{product.description}
				</Text>
				{/* Text component to display product price */}
				<Text
					noOfLines={1}
					mt={2}
					fontWeight='semibold'
				>
					Price: ${product.price}
				</Text>
			</Box>
		</Stack>
	</Box>
);

// Define PropTypes for the ProductListItem component
ProductListItem.propTypes = {
	product: PropTypes.shape({
		title: PropTypes.string.isRequired, // Title of the product (required)
		thumbnail: PropTypes.string.isRequired, // URL of the product thumbnail image (required)
		description: PropTypes.string.isRequired, // Description of the product (required)
		price: PropTypes.number.isRequired, // Price of the product (required)
	}).isRequired,
};

// Export the ProductListItem component as default
export default ProductListItem;
