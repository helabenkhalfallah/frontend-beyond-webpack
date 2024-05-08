import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import Router from './routes/Router';

const container = document.getElementById('webpack-frontend-root');

const root = createRoot(container);

// eslint-disable-next-line react/jsx-filename-extension
root.render(
	// eslint-disable-next-line react/jsx-filename-extension
	<ChakraProvider>
		<Router />
	</ChakraProvider>
);

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('./service-worker.js')
			.then((registration) => {
				// eslint-disable-next-line no-console
				console.log('SW registered: ', registration);
			})
			.catch((registrationError) => {
				// eslint-disable-next-line no-console
				console.log('SW registration failed: ', registrationError);
			});
	});
}
