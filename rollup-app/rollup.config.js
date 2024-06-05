import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import json from '@rollup/plugin-json';
import html from '@rollup/plugin-html';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import { cleandir } from 'rollup-plugin-cleandir';
import { visualizer } from 'rollup-plugin-visualizer';

const isProduction = process.env.NODE_ENV === 'production';

console.log('isProduction: ', isProduction);

export default {
    input: 'src/index.jsx', // Entry point for your React application
    output: {
        dir: 'dist', // Output directory for the bundle
        format: 'es', // ES module format
        name: 'FrontendRollupApp', // Global variable name for the bundle
        sourcemap: true // Generate sourcemap for debugging
    },
    plugins: [
        cleandir('dist'), // Clean the dist directory before each build
        resolve({
            preferBuiltins: true,
            extensions: ['.js', '.jsx'] // Resolve .js and .jsx files
        }),
        commonjs(), // Convert CommonJS modules to ES6
        babel({
            exclude: 'node_modules/**', // Only transpile our source code
            babelHelpers: 'bundled',
            presets: ['@babel/preset-env', '@babel/preset-react'] // Babel presets for modern JavaScript and React
        }),
        replace({
            preventAssignment: true,
            'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development') // Replace environment variables
        }),
        postcss({
            extensions: ['.css'], // Process CSS files
            extract: true // Extract CSS into a separate file
        }),
        globals(), // Polyfill Node.js globals for the browser
        builtins(), // Polyfill Node.js core modules for the browser
        isProduction && terser(), // Minify the bundle in production
        !isProduction && serve({
            open: true, // Automatically open the browser
            contentBase: 'dist', // Serve from the dist directory
            port: 3000 // Serve on port 3000
        }),
        !isProduction && livereload({
            watch: 'dist' // Watch the dist directory for changes
        }),
        json(), // Support importing JSON files
        html({
            template: ({ bundle }) => {
                const formattedOutput = Object
                    .keys(bundle || {})
                    .filter(name => !name.endsWith('.map'))
                    .map(name => `<script type="module" src="${name}"></script>`)
                    .join('\n');

                return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rollup + React</title>
  </head>
  <body>
    <div id="rollup-frontend-root"></div>
    ${formattedOutput}
  </body>
</html>`;
            }
        }),
        isProduction && visualizer({
            filename: 'bundle-analysis.html', // Output file for the visualization
            open: true // Automatically open the visualization in the browser
        })
    ],
    onwarn: () => false // Suppress warnings
};
