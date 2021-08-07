"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_maker_mixin_1 = require("./client-mixins/request-maker.mixin");
/**
 * Base class for Twitter instances
 */
class TwitterApiBase extends request_maker_mixin_1.ClientRequestMaker {
    constructor(token) {
        super();
        if (typeof token === 'string') {
            this._bearerToken = token;
        }
        else if (token instanceof TwitterApiBase) {
            this._accessToken = token._accessToken;
            this._accessSecret = token._accessSecret;
            this._consumerToken = token._consumerToken;
            this._consumerSecret = token._consumerSecret;
            this._oauth = token._oauth;
            this._prefix = token._prefix;
            this._bearerToken = token._bearerToken;
            this._basicToken = token._basicToken;
        }
        else if (typeof token === 'object' && 'appKey' in token) {
            this._consumerToken = token.appKey;
            this._consumerSecret = token.appSecret;
            if (token.accessToken && token.accessSecret) {
                this._accessToken = token.accessToken;
                this._accessSecret = token.accessSecret;
            }
            this._oauth = this.buildOAuth();
        }
        else if (typeof token === 'object' && 'username' in token) {
            const key = encodeURIComponent(token.username) + ':' + encodeURIComponent(token.password);
            this._basicToken = Buffer.from(key).toString('base64');
        }
    }
    setPrefix(prefix) {
        this._prefix = prefix;
    }
    cloneWithPrefix(prefix) {
        const clone = this.constructor(this);
        clone.setPrefix(prefix);
        return clone;
    }
    getActiveTokens() {
        if (this._bearerToken) {
            return {
                type: 'oauth2',
                bearerToken: this._bearerToken,
            };
        }
        else if (this._basicToken) {
            return {
                type: 'basic',
                token: this._basicToken,
            };
        }
        else if (this._consumerSecret && this._oauth) {
            return {
                type: 'oauth-1.0a',
                appKey: this._consumerToken,
                appSecret: this._consumerSecret,
                accessToken: this._accessToken,
                accessSecret: this._accessSecret,
            };
        }
        return { type: 'none' };
    }
    async get(url, query = {}, { fullResponse, prefix = this._prefix, ...rest } = {}) {
        if (prefix)
            url = prefix + url;
        const resp = await this.send({
            url,
            method: 'GET',
            query,
            ...rest,
        });
        return fullResponse ? resp : resp.data;
    }
    async delete(url, query = {}, { fullResponse, prefix = this._prefix, ...rest } = {}) {
        if (prefix)
            url = prefix + url;
        const resp = await this.send({
            url,
            method: 'DELETE',
            query,
            ...rest
        });
        return fullResponse ? resp : resp.data;
    }
    async post(url, body, { fullResponse, prefix = this._prefix, ...rest } = {}) {
        if (prefix)
            url = prefix + url;
        const resp = await this.send({
            url,
            method: 'POST',
            body,
            ...rest,
        });
        return fullResponse ? resp : resp.data;
    }
    async put(url, body, { fullResponse, prefix = this._prefix, ...rest } = {}) {
        if (prefix)
            url = prefix + url;
        const resp = await this.send({
            url,
            method: 'PUT',
            body,
            ...rest,
        });
        return fullResponse ? resp : resp.data;
    }
    async patch(url, body, { fullResponse, prefix = this._prefix, ...rest } = {}) {
        if (prefix)
            url = prefix + url;
        const resp = await this.send({
            url,
            method: 'PATCH',
            body,
            ...rest,
        });
        return fullResponse ? resp : resp.data;
    }
    /** Stream request helpers */
    async getStream(url, query, { prefix = this._prefix } = {}) {
        if (prefix)
            url = prefix + url;
        return this.sendStream({
            url,
            method: 'GET',
            query,
        });
    }
    async deleteStream(url, query, { prefix = this._prefix } = {}) {
        if (prefix)
            url = prefix + url;
        return this.sendStream({
            url,
            method: 'DELETE',
            query,
        });
    }
    async postStream(url, body, { prefix = this._prefix, ...rest } = {}) {
        if (prefix)
            url = prefix + url;
        return this.sendStream({
            url,
            method: 'POST',
            body,
            ...rest,
        });
    }
    async putStream(url, body, { prefix = this._prefix, ...rest } = {}) {
        if (prefix)
            url = prefix + url;
        return this.sendStream({
            url,
            method: 'PUT',
            body,
            ...rest,
        });
    }
    async patchStream(url, body, { prefix = this._prefix, ...rest } = {}) {
        if (prefix)
            url = prefix + url;
        return this.sendStream({
            url,
            method: 'PATCH',
            body,
            ...rest,
        });
    }
}
exports.default = TwitterApiBase;
