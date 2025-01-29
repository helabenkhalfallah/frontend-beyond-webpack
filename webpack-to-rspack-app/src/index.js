import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import Router from './routes/Router';

const container = document.getElementById('webpack-to-rspack-frontend-root');

const root = createRoot(container);

// eslint-disable-next-line react/jsx-filename-extension
root.render(
	// eslint-disable-next-line react/jsx-filename-extension
	<ChakraProvider>
		<Router />
	</ChakraProvider>
);
