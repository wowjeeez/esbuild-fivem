
async function watch() {
    const chalk = (await import("chalk")).default
    const exec = (await import("child_process")).exec;
    require('esbuild').build({
        entryPoints: ['client/client.ts'],
        bundle: true,
        outfile: 'dist/client.js',
        target: ["chrome58"],
        format: "iife",
        watch: {
            onRebuild: (err, res) => {
                if (err) {
                    console.log(chalk.red("[client]: Rebuild failed :("), err)
                } else {
                    console.log(chalk.green("[client]: Rebuild succeeded :), warnings:"), res.warnings)
                    console.log(chalk.yellow("[client]: Checking types..."))
                    const p = exec("tsc -p client", (err) => {
                        if (!err) {
                            console.log(chalk.green("[client]: Typechecking finished without errors :)"))
                        } else {
                            console.log(chalk.red("[client]: Typechecking finished with errors (see above) :("))
                        }
                    })
                    p.stdout.on("data", (d) => {
                        console.log(chalk.yellow(`[client::typecheck]: ${d.toString()}`))
                    })
                }
            }
        }
    }).then((r) => console.log(chalk.green("[client]: Watching..."))).catch((err) => {
        console.log(err)
        process.exit(1)
    })

    require('esbuild').build({
        entryPoints: ['server/server.ts'],
        bundle: true,
        outfile: 'dist/server.js',
        format: "cjs",
        platform: "node",
        watch: {
            onRebuild: async (err, res) => {
                if (err) {
                    console.log(chalk.red("[server]: Rebuild failed :("), err)
                } else {
                    console.log(chalk.green("[server]: Rebuild succeeded :), warnings:"), res.warnings)
                    console.log(chalk.yellow("[server]: Checking types..."))
                    const p = exec("tsc -p server", (err) => {
                        if (!err) {
                            console.log(chalk.green("[server]: Typechecking finished without errors :)"))
                        } else {
                            console.log(chalk.red("[server]: Typechecking finished with errors (see above) :("))
                        }
                    })
                    p.stdout.on("data", (d) => {
                        console.log(chalk.yellow(`[server::typecheck]: ${d.toString()}`))
                    })
                }
            }
        }
    }).then(() => console.log(chalk.green("[server]: Watching..."))).catch((err) => {
        console.log(err)
        process.exit(1)
    })
}

watch()