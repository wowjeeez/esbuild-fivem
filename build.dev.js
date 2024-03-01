const chokidar = require('chokidar');
const { build } = require('esbuild');
const path = require('path');
const fs = require('fs');

async function buildEntrypoint(entryPoint, outdir, target, format, platform) {
    try {
        await build({
            entryPoints: [entryPoint],
            bundle: true,
            outdir,
            target,
            format,
            platform,
            minify: false,
        });

        const folderName = entryPoint.includes('server') ? 'server' : 'client';
        console.log(
            (await import('chalk')).default.green(
                `[${folderName}]: Built successfully!`,
            ),
        );
    } catch (error) {
        console.error(
            (await import('chalk')).default.red(
                `Error building ${entryPoint}: ${error.message}`,
            ),
        );
    }
}

async function watchFolder(entryPoint, outDir, target, format, platform) {
    const chalk = (await import('chalk')).default;
    await buildEntrypoint(entryPoint, outDir, target, format, platform);

    // Using the derived folder name to log the correct folder
    const folderName = entryPoint.includes('server') ? 'server' : 'client';
    console.log(chalk.yellow(`[${folderName}]: Watching for changes...`));

    chokidar
        .watch(path.dirname(entryPoint), {
            ignoreInitial: true,
        })
        .on('change', async (event, path) => {
            // Remove everything before the folder name
            event = event.replace(__dirname, '');

            console.log(
                chalk.yellow(
                    `[${folderName}]: File changed: ${event} - Rebuilding...`,
                ),
            );

            await buildEntrypoint(entryPoint, outDir, target, format, platform);
        });
}

async function watchAll() {
    const folders = ['server', 'client'];

    for (const folder of folders) {
        const folderPath = path.join(__dirname, folder);

        // Find server.ts or client.ts (our entrypoints)
        let entryPoint = fs.readdirSync(folderPath);

        if (!entryPoint) {
            console.log(
                (await import('chalk')).default.red(
                    `[${folder}]: No results returned from readdirSync. Please make sure the ${folder} folder contains a entrypoint file (server.ts or client.ts).`,
                ),
            );
            process.exit(1);
        }

        // Check if we have an entrypoint
        if (!entryPoint.includes(`${folder}.ts`)) {
            console.log(
                (await import('chalk')).default.red(
                    `[${folder}]: No entrypoint found! Please create a entrypoint file (server.ts or client.ts) in the ${folder} folder.`,
                ),
            );
            process.exit(1);
        }

        entryPoint = entryPoint.find((file) => {
            return file.endsWith('.ts') && file === `${folder}.ts`;
        });

        console.log(
            (await import('chalk')).default.yellow(
                `[${folder}]: Building entrypoint: ${entryPoint}...`,
            ),
        );

        await watchFolder(
            path.join(folderPath, entryPoint),
            path.join(__dirname, 'dist', folder),
            folder === 'client' ? ['chrome58'] : undefined,
            folder === 'client' ? 'iife' : 'cjs',
            folder === 'server' ? 'node' : undefined,
        );
    }
}

watchAll();
