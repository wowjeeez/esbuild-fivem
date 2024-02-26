const chokidar = require('chokidar');
const { build } = require('esbuild');
const path = require('path');

async function buildFolder(folder, outdir, target, format, platform) {
    const chalk = (await import('chalk')).default;
    console.log(chalk.yellow(`[${folder}]: Building...`));

    try {
        const files = require('fs')
            .readdirSync(folder)
            .filter((file) => file.endsWith('.ts'));

        const entryPoints = files.map((file) =>
            require('path').join(folder, file),
        );

        await build({
            entryPoints,
            bundle: true,
            outdir,
            target,
            format,
            platform,
            minify: false,
        });

        console.log(chalk.green(`[${folder}]: Built successfully!`));
    } catch (error) {
        console.log(chalk.red(`[${folder}]: Build failed!`));
        console.error(error);
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
