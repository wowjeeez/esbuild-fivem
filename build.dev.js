const chokidar = require('chokidar');
const { build } = require('esbuild');
const path = require('path');
const fs = require('fs');

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

async function watchFolder(folder, outDir, target, format, platform) {
    const chalk = (await import('chalk')).default;
    await buildFolder(folder, outDir, target, format, platform);

    const watcher = chokidar.watch(`${folder}/**/*.ts`, {
        ignoreInitial: true,
    });

    console.log(chalk.yellow(`[${folder}]: Watching for changes...`));

    watcher.on('change', async (filePath) => {
        console.log(chalk.yellow(`[${folder}]: File changed: ${filePath}`));
        await buildFolder(folder, outDir, target, format, platform);
    });
}

async function watchAll() {
    const folders = ['server', 'client'];

    for (const folder of folders) {
        await watchFolder(
            folder,
            path.join(__dirname, 'dist', folder),
            folder === 'client' ? ['chrome58'] : undefined,
            folder === 'client' ? 'iife' : 'cjs',
            folder === 'server' ? 'node' : undefined,
        );
    }
}

watchAll();
