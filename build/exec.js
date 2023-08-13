"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeScript = exports.queryScript = exports.getKeys = void 0;
const child_process_1 = require("child_process");
const _1 = require(".");
function execShellCommand(cmd) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(cmd, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}
exports.default = execShellCommand;
const getKeys = (keyringBackend = 'test') => __awaiter(void 0, void 0, void 0, function* () {
    const cmd = `dysond keys list --keyring-backend ${keyringBackend} --output json`;
    const result = yield execShellCommand(cmd);
    return JSON.parse(result);
});
exports.getKeys = getKeys;
const queryScript = (scriptAddr, scriptFunc) => __awaiter(void 0, void 0, void 0, function* () {
    const cmd = `dysond q dyson eval ${scriptAddr} --function ${scriptFunc} --node ${_1.RPC} --output json`;
    const result = yield execShellCommand(cmd);
    const parsed = JSON.parse(JSON.parse(result).response);
    if (parsed.exception)
        throw new Error(parsed.exception.msg);
    return parsed.result;
});
exports.queryScript = queryScript;
const executeScript = (scriptAddr, scriptFunc, keyringBackend = 'test') => __awaiter(void 0, void 0, void 0, function* () {
    const cmd = `dysond tx dyson run ${scriptAddr} --function ${scriptFunc} --node ${_1.RPC} --output json --from ${_1.KEYID} --keyring-backend ${keyringBackend} --gas-prices ${_1.GAS_PRICES} --broadcast-mode block --chain-id ${_1.CHAINID} --gas 900000 -y`;
    const result = yield execShellCommand(cmd);
    const parsed = JSON.parse(result);
    if (parsed.code) {
        throw `Failed to Execute: ${parsed.raw_log}`;
    }
    return parsed;
});
exports.executeScript = executeScript;
