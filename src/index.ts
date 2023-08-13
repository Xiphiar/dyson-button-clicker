import { executeScript, getKeys, queryScript } from './exec';
import { getStatus } from './helpers';

export const SCRIPT = 'dys10gl3kv0fmx2xyv4dm7gurqt95qe43r2k8j4xly'
export const RPC = 'http://dys-tm.dysonprotocol.com:26657'
export const CHAINID = 'dyson-mainnet-01'
export const KEYID = 'autoplay'
export const GAS_PRICES = '0.0001dys'


const ONE_MINUTE = 60000
const FIVE_MINUTES = 300000

const main = async () => {
    // Verify Key Exists
    const keys = await getKeys();
    const winnerKey = keys.find((k: any)=>k.name===KEYID)
    if (!winnerKey) {
        throw 'Key Not Found'
    }

    // Start
    console.log('Winner Address:', winnerKey.address)

    // Startup Check
    await ensureWinner(winnerKey.address)

    setInterval(ensureWinner, ONE_MINUTE, winnerKey.address);

    console.log('Running on interval.')
}

const ensureWinner = async (desiredWinner: string) => {
    try {
        console.log('Checking winner...')
        const {last_caller: winner, remaining_time} = await getStatus(SCRIPT)
        console.log('Current Winner', winner)

        // Click button if not winner
        if (winner !== desiredWinner) {
            console.log('Clicking the button!')

            const result = await executeScript(SCRIPT, 'press_button');
            console.log('Done clicking.')

        // Claim prize if over
        } else if (remaining_time === 0) {
            console.log('Claiming Prize!')
            const result = await executeScript(SCRIPT, 'withdraw_prize');
            console.log('Done claiming!!!')
            process.exit()
        
        // We are winning!
        } else {
            console.log(`We (${desiredWinner}) are winning!`)
        }
    } catch(error: any) {
        console.error('Failed to ensure winner:', error.toString())
    }
}

main();