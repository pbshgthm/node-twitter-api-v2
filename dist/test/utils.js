"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppClient = exports.getAccessClient = exports.getAuthLink = exports.getRequestClient = exports.sleepTest = exports.getUserClient = void 0;
const __1 = require("..");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: __dirname + '/../../.env' });
/** User OAuth 1.0a client */
function getUserClient() {
    if (this.__client) {
        return this.__client;
    }
    return this.__client = new __1.TwitterApi({
        appKey: process.env.CONSUMER_TOKEN,
        appSecret: process.env.CONSUMER_SECRET,
        accessToken: process.env.OAUTH_TOKEN,
        accessSecret: process.env.OAUTH_SECRET,
    });
}
exports.getUserClient = getUserClient;
async function sleepTest(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleepTest = sleepTest;
/** User-unlogged OAuth 1.0a client */
function getRequestClient() {
    return new __1.TwitterApi({
        appKey: process.env.CONSUMER_TOKEN,
        appSecret: process.env.CONSUMER_SECRET,
    });
}
exports.getRequestClient = getRequestClient;
// Test auth 1.0a flow
function getAuthLink(callback) {
    return getRequestClient().generateAuthLink(callback);
}
exports.getAuthLink = getAuthLink;
async function getAccessClient(verifier) {
    let requestClient = new __1.TwitterApi({
        appKey: process.env.CONSUMER_TOKEN,
        appSecret: process.env.CONSUMER_SECRET,
        accessToken: process.env.OAUTH_TOKEN,
        accessSecret: process.env.OAUTH_SECRET,
    });
    const { client } = await requestClient.login(verifier);
    return client;
}
exports.getAccessClient = getAccessClient;
/** App OAuth 2.0 client */
function getAppClient() {
    let requestClient;
    if (process.env.BEARER_TOKEN) {
        requestClient = new __1.TwitterApi(process.env.BEARER_TOKEN);
        return Promise.resolve(requestClient);
    }
    else {
        requestClient = new __1.TwitterApi({
            appKey: process.env.CONSUMER_TOKEN,
            appSecret: process.env.CONSUMER_SECRET,
        });
        return requestClient.appLogin();
    }
}
exports.getAppClient = getAppClient;
