// Importing required modules
import path from 'node:path'; // Importing the 'path' module from Node.js for handling and transforming file paths
import fs from 'node:fs'; // Importing the 'fs' module from Node.js for handling file system operations
import process from 'node:process'; // Importing the 'process' module from Node.js for accessing information about the current Node.js process
import esbuild from 'esbuild'; // Importing the 'esbuild' module for bundling and minifying JavaScript for web distribution
import { clean } from 'esbuild-plugin-clean'; // Importing the 'clean' function from 'esbuild-plugin-clean' for cleaning up output/assets before building
import { compress } from 'esbuild-plugin-compress'; // Importing the 'compress' function from 'esbuild-plugin-compress' for compressing the bundled code

// Get the command line arguments
const args = process.argv; // Storing the command line arguments in the 'args' variable

// Define the configuration for esbuild
const config = {
    logLevel: 'info', // Setting the level of logging to 'info'
    entryPoints: ['src/index.js'], // Setting the entry point of the application to 'src/index.js'
    bundle: true, // Enabling code bundling
    loader: { '.js': 'jsx' }, // Setting the loader for JavaScript files to 'jsx'
};

// Function to copy assets
const copyAssets = (outputFiles, mode) => {
    // If the mode is 'development' and the 'dist' directory exists, remove it
    if(mode === 'development' && fs.existsSync('dist')) {
        fs.rmSync('dist', { recursive: true, force: true });
    }

    // Define the path of the output HTML file
    const outputHtmlFile = './dist/index.html';

    // Copy the 'public' directory to the 'dist' directory
    fs.cpSync('./public', './dist', {recursive: true});

    // Generate the script tags for the output files
    const outputScripts = outputFiles
        .map(chunk => `    <script type="module" src="./${path.basename(chunk.path)}"></script>`)
        .join('\n');

    // Read the content of the output HTML file
    const htmlNewContent = fs
        .readFileSync(outputHtmlFile, { encoding: 'utf8', flag: 'r' })
        .replace('</body>', `${outputScripts}\n</body>`); // Replace the '</body>' tag with the script tags and the '</body>' tag

    // Write the new content to the output HTML file
    fs.writeFileSync(outputHtmlFile, htmlNewContent);
};

// If the '--build' argument is passed in, build the application
if (args.includes('--build')) {
    esbuild
        .build({
            ...config, // Use the defined configuration
            sourcemap: false, // Don't generate a source map
            minify: true, // Minify the code
            treeShaking: true, // Enable dead code elimination
            metafile: true, // Generate stats about the bundle
            splitting: true, // Enable code splitting
            format: 'esm', // Use ES modules
            outdir: 'dist', // Set the output directory for the build to 'dist'
            write: false, // Don't write the output to disk
            plugins: [
                clean({
                    patterns: ['./dist/*', 'meta.json'], // Define the patterns to clean
                }),
                compress({
                    outputDir: '.', // Set the output directory for the compressed files to '.'
                    exclude: ['**/*.map'], // Exclude source map files from compression
                }),
            ],
        })
        .then(result => {
            // After the build, copy the assets
            copyAssets(result.outputFiles, 'production');

            // Write the metafile to disk
            fs.writeFileSync('meta.json', JSON.stringify(result.metafile));
        })
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
            outfile: 'dist/Bundle.js', // Set the output file to 'dist/Bundle.js'
            sourcemap: true, // Generate a source map
        })
        .then(async (ctx) => {
            // After the context is created, copy the assets
            copyAssets(
                [
                    {
                        path: 'Bundle.js' // Define the path of the bundle
                    }
                ],
                'development');

            // Watch the files for changes
            await ctx.watch();
            // Serve the files
            await ctx.serve({
                servedir: 'dist', // Set the directory to serve to 'dist'
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
