const fs = require('fs');
const path = require('path');
const { build } = require('esbuild');

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
        console.error(error);
        process.exit(1);
    }
}

async function buildAll() {
    console.log((await import('chalk')).default.yellow('Building...'));
    const folders = ['server', 'client'];

    for (const folder of folders) {
        const folderPath = path.join(__dirname, folder);
        const outDir = path.join(__dirname, 'dist', folder);

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

        await buildEntrypoint(
            path.join(folderPath, entryPoint),
            outDir,
            folder === 'client' ? ['chrome58'] : undefined,
            folder === 'client' ? 'iife' : 'cjs',
            folder === 'server' ? 'node' : undefined,
        );
    }

    console.log(
        (await import('chalk')).default.green('Built all successfully!'),
    );
}

buildAll();
