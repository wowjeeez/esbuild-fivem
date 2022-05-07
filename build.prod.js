async function build() {
    const chalk = (await import("chalk")).default


    require('esbuild').build({
        entryPoints: ['client/client.ts'],
        bundle: true,
        outfile: 'dist/client.js',
        target: ["chrome58"],
        minify: false,
        format: "iife",
    }).then(() => console.log(chalk.green("[client]: Built successfully!"))).catch(() => process.exit(1))

    require('esbuild').build({
        entryPoints: ['server/server.ts'],
        bundle: true,
        outfile: 'dist/server.js',
        format: "cjs",
        minify: false,
        platform: "node",
    }).then(() => console.log(chalk.green("[server]: Built successfully!"))).catch(() => process.exit(1))
}

build()
