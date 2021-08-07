"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const utils_1 = require("./utils");
(async () => {
    const argActive = (name) => process.argv.find(arg => arg.startsWith('--' + name));
    const argValue = (name) => {
        // Find active index
        const activeIndex = process.argv.findIndex(arg => arg.startsWith('--' + name));
        return process.argv[activeIndex + 1];
    };
    if (argActive('access-token')) {
        const client = await utils_1.getAccessClient(argValue('access-token'));
        console.log(client.getActiveTokens());
    }
    else if (argActive('request-token')) {
        console.log(await utils_1.getAuthLink(argValue('request-token')));
    }
    else if (argActive('app-client')) {
        // Test some basics requests
        const client = await utils_1.getAppClient();
        const node = await client.search('nodeJS');
        await node.fetchNext();
    }
})().catch(e => {
    console.error('Unexcepted error:', e);
    console.error(__1.TwitterApi.getErrors(e));
});
