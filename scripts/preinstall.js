if (!/pnpm/.test(process.env.npm_execpath || '')) {
    console.log('不懂问然叔,13611388415')
    console.warn(
        `\u001b[33mThis repository requires using pnpm as the package manager ` +
        ` for scripts to work properly.\u001b[39m\n`
    )
    process.exit(1)
}