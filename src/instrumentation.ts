export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        console.log('Patching logger')
        await require('pino')
        await require('pino-pretty')
        await require('colorette')
        await require('next-logger')
    }
}
