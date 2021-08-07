"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const client_base_1 = __importDefault(require("../client.base"));
const client_v1_read_1 = __importDefault(require("../v1/client.v1.read"));
const client_v2_read_1 = __importDefault(require("../v2/client.v2.read"));
/**
 * Twitter v1.1 and v2 API client.
 */
class TwitterApiReadOnly extends client_base_1.default {
    /* Direct access to subclients */
    get v1() {
        if (this._v1)
            return this._v1;
        return this._v1 = new client_v1_read_1.default(this);
    }
    get v2() {
        if (this._v2)
            return this._v2;
        return this._v2 = new client_v2_read_1.default(this);
    }
    /**
     * Fetch and cache current user.
     * This method can only be called with a OAuth 1.0a user authentification.
     *
     * You can use this method to test if authentification was successful.
     * Next calls to this methods will use the cached user, unless `forceFetch: true` is given.
     */
    async currentUser(forceFetch = false) {
        if (!forceFetch && this._currentUser) {
            return this._currentUser;
        }
        return this._currentUser = await this.v1.verifyCredentials();
    }
    /* Shortcuts to endpoints */
    search(what, options) {
        return this.v2.search(what, options);
    }
    /* Authentification */
    /**
     * Generate the OAuth request token link for user-based OAuth 1.0 auth.
     *
     * ```ts
     * // Instanciate TwitterApi with consumer keys
     * const client = new TwitterApi({ appKey: 'consumer_key', appSecret: 'consumer_secret' });
     *
     * const tokenRequest = await client.generateAuthLink('oob-or-your-callback-url');
     * // redirect end-user to tokenRequest.url
     *
     * // Save tokenRequest.oauth_token_secret somewhere, it will be needed for next auth step.
     * ```
     */
    async generateAuthLink(oauth_callback = 'oob', { authAccessType, linkMode = 'authenticate' } = {}) {
        const oauth_result = await this.post('https://api.twitter.com/oauth/request_token', { oauth_callback, x_auth_access_type: authAccessType });
        return {
            url: `https://api.twitter.com/oauth/${linkMode}?oauth_token=${encodeURIComponent(oauth_result.oauth_token)}`,
            ...oauth_result,
        };
    }
    /**
     * Obtain access to user-based OAuth 1.0 auth.
     *
     * After user is redirect from your callback, use obtained oauth_token and oauth_verifier to
     * instanciate the new TwitterApi instance.
     *
     * ```ts
     * // Use the saved oauth_token_secret associated to oauth_token returned by callback
     * const requestClient = new TwitterApi({
     *  appKey: 'consumer_key',
     *  appSecret: 'consumer_secret',
     *  accessToken: 'oauth_token',
     *  accessSecret: 'oauth_token_secret'
     * });
     *
     * // Use oauth_verifier obtained from callback request
     * const { client: userClient } = await requestClient.login('oauth_verifier');
     *
     * // {userClient} is a valid {TwitterApi} object you can use for future requests
     * ```
     */
    async login(oauth_verifier) {
        const oauth_result = await this.post('https://api.twitter.com/oauth/access_token', { oauth_token: this._accessToken, oauth_verifier });
        const client = new _1.default({
            appKey: this._consumerToken,
            appSecret: this._consumerSecret,
            accessToken: oauth_result.oauth_token,
            accessSecret: oauth_result.oauth_token_secret,
        });
        return {
            accessToken: oauth_result.oauth_token,
            accessSecret: oauth_result.oauth_token_secret,
            userId: oauth_result.user_id,
            screenName: oauth_result.screen_name,
            client,
        };
    }
    /**
     * Enable application-only authentification.
     *
     * To make the request, instanciate TwitterApi with consumer and secret.
     *
     * ```ts
     * const requestClient = new TwitterApi({ appKey: 'consumer', appSecret: 'secret' });
     * const appClient = await requestClient.appLogin();
     *
     * // Use {appClient} to make requests
     * ```
     */
    async appLogin() {
        if (!this._consumerToken || !this._consumerSecret)
            throw new Error('You must setup TwitterApi instance with consumers to enable app-only login');
        // Create a client with Basic authentification
        const basicClient = new _1.default({ username: this._consumerToken, password: this._consumerSecret });
        const res = await basicClient.post('https://api.twitter.com/oauth2/token', { grant_type: 'client_credentials' });
        // New object with Bearer token
        return new _1.default(res.access_token);
    }
}
exports.default = TwitterApiReadOnly;
