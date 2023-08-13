import {exec} from 'child_process'
import { CHAINID, GAS_PRICES, KEYID, RPC } from '.';

export default function execShellCommand(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
        if (error) {
        console.warn(error);
        }
        resolve(stdout? stdout : stderr);
        });
    });
}

export const getKeys = async (keyringBackend = 'test') => {
    const cmd = `dysond keys list --keyring-backend ${keyringBackend} --output json`
    const result = await execShellCommand(cmd)
    return JSON.parse(result);
}

export const queryScript = async (scriptAddr: string, scriptFunc: string) => {
    const cmd = `dysond q dyson eval ${scriptAddr} --function ${scriptFunc} --node ${RPC} --output json`
    const result = await execShellCommand(cmd)
    const parsed = JSON.parse(JSON.parse(result).response);
    if (parsed.exception) throw new Error(parsed.exception.msg);

    return parsed.result;
}

export const executeScript = async (scriptAddr: string, scriptFunc: string, keyringBackend = 'test') => {
    const cmd = `dysond tx dyson run ${scriptAddr} --function ${scriptFunc} --node ${RPC} --output json --from ${KEYID} --keyring-backend ${keyringBackend} --gas-prices ${GAS_PRICES} --broadcast-mode block --chain-id ${CHAINID} --gas 900000 -y`
    const result = await execShellCommand(cmd)
    const parsed = JSON.parse(result)
    if (parsed.code) {
        throw `Failed to Execute: ${parsed.raw_log}`
    }

    return parsed;
}