const child_process = require('child_process')

const run = (cmd, cwd = '.') => new Promise((resolve, reject) => {
    console.log('run', cmd, 'in', cwd)
    const parts = cmd.split(' ')
    const cp = child_process.spawn(parts[0], parts.slice(1), {stdio: "inherit", cwd})
    cp.on('close', code => code !== 0 ? reject(code) : resolve())
})

const lib_folder = "./whatsdapp-lib"
;(async function () {
    if (process.argv[2] === "pre") {
        console.log("preinstall")
        //await run('git submodule init')
        await run('git submodule update --init')
    } else if (process.argv[2] === "post") {
        console.log("postinstall")
        await run('npm install', lib_folder)
        await run(`npm rebuild grpc --runtime=electron --target=v10.1.5`)
        await run('npm run dist', lib_folder)
    }
})()
