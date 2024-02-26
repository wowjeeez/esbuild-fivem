const fs = require('fs');
const path = require('path');
const { build } = require('esbuild');

function getAllFiles(folder) {
    let result = [];
    const files = fs.readdirSync(folder);

    for (const file of files) {
        const filePath = path.join(folder, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            result = result.concat(getAllFiles(filePath));
        } else if (file.endsWith('.ts')) {
            result.push(filePath);
        }
    }

    return result;
}

async function buildFolder(folder, outdir, target, format, platform) {
    try {
        const entryPoints = getAllFiles(folder);

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
