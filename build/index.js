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
exports.GAS_PRICES = exports.KEYID = exports.CHAINID = exports.RPC = exports.SCRIPT = void 0;
const exec_1 = require("./exec");
const helpers_1 = require("./helpers");
const MNEMONIC = `robust perfect wood learn symbol crew pumpkin vapor frame color network possible gift stay soft vocal skate original cotton voyage camera write trash solve`;
exports.SCRIPT = 'dys10gl3kv0fmx2xyv4dm7gurqt95qe43r2k8j4xly';
exports.RPC = 'http://dys-tm.dysonprotocol.com:26657';
exports.CHAINID = 'dyson-mainnet-01';
exports.KEYID = 'autoplay';
exports.GAS_PRICES = '0.0001dys';
const ONE_MINUTE = 60000;
const FIVE_MINUTES = 300000;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // Verify Key Exists
    const keys = yield (0, exec_1.getKeys)();
    const winnerKey = keys.find((k) => k.name === exports.KEYID);
    if (!winnerKey) {
        throw 'Key Not Found';
    }
    console.log('Winner Address:', winnerKey.address);
    // Startup Check
    yield ensureWinner(winnerKey.address);
    setInterval(ensureWinner, ONE_MINUTE, winnerKey.address);
    console.log('Running on interval.');
});
const ensureWinner = (desiredWinner) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Checking winner...');
        const { last_caller: winner, remaining_time } = yield (0, helpers_1.getStatus)(exports.SCRIPT);
        console.log('Current Winner', winner);
        // Click button if not winner
        if (winner !== desiredWinner) {
            console.log('Clicking the button!');
            const result = yield (0, exec_1.executeScript)(exports.SCRIPT, 'press_button');
            console.log('Done clicking.');
            // Claim prize if over
        }
        else if (remaining_time === 0) {
            console.log('Claiming Prize!');
            const result = yield (0, exec_1.executeScript)(exports.SCRIPT, 'withdraw_prize');
            console.log('Done claiming!!!');
            process.exit();
            // We are winning!
        }
        else {
            console.log(`We (${desiredWinner}) are winning!`);
        }
    }
    catch (error) {
        console.error('Failed to ensure winner:', error.toString());
    }
});
main();
