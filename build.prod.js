const fs = require('fs');
const path = require('path');
const { build } = require('esbuild');

async function buildFolder(folder, outdir, target, format, platform) {
    try {
        const files = fs
            .readdirSync(folder)
            .filter((file) => file.endsWith('.ts'));
        const entryPoints = files.map((file) => path.join(folder, file));

        await build({
            entryPoints,
            bundle: true,
            outdir,
            target,
            format,
            platform,
            minify: false,
        });

        const folderName = folder.includes('server') ? 'server' : 'client';
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

        await buildFolder(
            folderPath,
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
