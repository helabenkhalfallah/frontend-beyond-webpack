// Importing required modules
import fs from 'fs';
import process from 'node:process'; // The process object is a global that provides information about, and control over, the current Node.js process.
import esbuild from 'esbuild'; // esbuild is a JavaScript bundler and minifier. It packages up JavaScript and TypeScript code for distribution on the web.
import { compress } from 'esbuild-plugin-compress';

// Get the command line arguments
const args = process.argv;

// Define the configuration for esbuild
const config = {
    logLevel: 'info', // The level of logging to use
    entryPoints: ['src/index.js'], // The entry point of the application
    bundle: true, // Whether to bundle the code or not
    loader: { '.js': 'jsx' }, // The loader to use for JavaScript files
};

// If the '--build' argument is passed in, build the application
if (args.includes('--build')) {
    esbuild
        .build({
            ...config, // Use the defined configuration
            sourcemap: false, // Don't generate a source map
            minify: true, // Minify the code
            treeShaking: true, // dead code elimination
            metafile: true, // stats about bundle
            splitting: true, // create chunks
            format: 'esm',
            outdir: 'public/build',
            write: false,
            plugins: [
                compress({
                    outputDir: '.',
                    exclude: ['**/*.map'],
                }),
            ],
        })
        .then(result => fs.writeFileSync('meta.json', JSON.stringify(result.metafile)))
        .catch((e) => {
            // If there's an error, log it and exit the process with a status of 1
            console.error(e);
            process.exit(1);
        });
}

// If the '--start' argument is passed in, start the application
if (args.includes('--start')) {
    esbuild
        .context({
            ...config, // Use the defined configuration
            minify: false, // Don't minify the code
            outfile: 'public/build/Bundle.js', // The output file for the bundled code
            sourcemap: true, // Generate a source map
        })
        .then(async (ctx) => {
            // Watch the files for changes
            await ctx.watch();
            // Serve the files
            await ctx.serve({
                servedir: 'public', // The directory to serve
                onRequest: ({
                                remoteAddress,
                                method,
                                path,
                                status,
                                timeInMS
                            }) => {
                    // Log each request
                    console.info(remoteAddress, status, `"${method} ${path}" [${timeInMS}ms]`);
                },
            });
        })
        .catch((e) => {
            // If there's an error, log it and exit the process with a status of 1
            console.error(e);
            process.exit(1);
        });
}



