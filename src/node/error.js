function handle(e) {
    console.log("unhandled error:")
    console.log(e)
    process.exit(1)
}

process.on('uncaughtException', handle)
process.on('unhandledRejection', handle)