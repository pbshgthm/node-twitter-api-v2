"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestHandlerHelper = exports.ClientRequestMaker = void 0;
const types_1 = require("../types");
const TweetStream_1 = __importDefault(require("../stream/TweetStream"));
const url_1 = require("url");
const https_1 = require("https");
const helpers_1 = require("../helpers");
const oauth1_helper_1 = __importDefault(require("./oauth1.helper"));
const settings_1 = require("../settings");
const form_data_helper_1 = require("./form-data.helper");
class ClientRequestMaker {
    /**
     * Send a new request and returns a wrapped `Promise<TwitterResponse<T>`.
     *
     * The request URL should not contains a query string, prefers using `parameters` for GET request.
     * If you need to pass a body AND query string parameter, duplicate parameters in the body.
     */
    send(options) {
        const args = this.getHttpRequestArgs(options);
        return this.httpSend(args.url, {
            method: args.method,
            headers: args.headers,
        }, args.body);
    }
    /**
     * Send a new request, then creates a stream from its as a `Promise<TwitterStream>`.
     *
     * The request URL should not contains a query string, prefers using `parameters` for GET request.
     * If you need to pass a body AND query string parameter, duplicate parameters in the body.
     */
    sendStream(options) {
        const args = this.getHttpRequestArgs(options);
        return this.httpStream(args.url, {
            method: args.method,
            headers: args.headers,
        }, args.body);
    }
    /* Token helpers */
    buildOAuth() {
        if (!this._consumerSecret || !this._consumerToken)
            throw new Error('Invalid consumer tokens');
        return new oauth1_helper_1.default({
            consumerKeys: { key: this._consumerToken, secret: this._consumerSecret },
        });
    }
    getOAuthAccessTokens() {
        if (!this._accessSecret || !this._accessToken)
            return;
        return {
            key: this._accessToken,
            secret: this._accessSecret,
        };
    }
    /* Request helpers */
    writeAuthHeaders({ headers, bodyInSignature, url, method, query, body }) {
        headers = { ...headers };
        if (this._bearerToken) {
            headers.Authorization = 'Bearer ' + this._bearerToken;
        }
        else if (this._basicToken) {
            // Basic auth, to request a bearer token
            headers.Authorization = 'Basic ' + this._basicToken;
        }
        else if (this._consumerSecret && this._oauth) {
            // Merge query and body
            const data = bodyInSignature ? RequestParamHelpers.mergeQueryAndBodyForOAuth(query, body) : query;
            const auth = this._oauth.authorize({
                url,
                method,
                data,
            }, this.getOAuthAccessTokens());
            headers = { ...headers, ...this._oauth.toHeader(auth) };
        }
        return headers;
    }
    getHttpRequestArgs({ url, method, query: rawQuery = {}, body: rawBody = {}, headers, forceBodyMode }) {
        let body = undefined;
        method = method.toUpperCase();
        headers = headers !== null && headers !== void 0 ? headers : {};
        // Add user agent header (Twitter recommands it)
        if (!headers['x-user-agent']) {
            headers['x-user-agent'] = 'Node.twitter-api-v2';
        }
        const query = RequestParamHelpers.formatQueryToString(rawQuery);
        url = RequestParamHelpers.mergeUrlQueryIntoObject(url, query);
        // Delete undefined parameters
        if (!(rawBody instanceof Buffer)) {
            helpers_1.trimUndefinedProperties(rawBody);
        }
        // OAuth signature should not include parameters when using multipart.
        const bodyType = forceBodyMode !== null && forceBodyMode !== void 0 ? forceBodyMode : RequestParamHelpers.autoDetectBodyType(url);
        // OAuth needs body signature only if body is URL encoded.
        const bodyInSignature = ClientRequestMaker.BODY_METHODS.has(method) && bodyType === 'url';
        headers = this.writeAuthHeaders({ headers, bodyInSignature, url, method, query, body: rawBody });
        if (ClientRequestMaker.BODY_METHODS.has(method)) {
            body = RequestParamHelpers.constructBodyParams(rawBody, headers, bodyType) || undefined;
        }
        url += RequestParamHelpers.constructGetParams(query);
        return {
            url,
            method,
            headers,
            body,
        };
    }
    httpSend(url, options, body) {
        if (body) {
            RequestParamHelpers.setBodyLengthHeader(options, body);
        }
        return new RequestHandlerHelper({ url, options, body })
            .makeRequest();
    }
    httpStream(url, options, body) {
        if (body) {
            RequestParamHelpers.setBodyLengthHeader(options, body);
        }
        return new RequestHandlerHelper({ url, options, body })
            .makeRequestAsStream();
    }
}
exports.ClientRequestMaker = ClientRequestMaker;
ClientRequestMaker.BODY_METHODS = new Set(['POST', 'PUT', 'PATCH']);
/* Helpers functions that are specific to this class but do not depends on instance */
class RequestParamHelpers {
    static formatQueryToString(query) {
        const formattedQuery = {};
        for (const prop in query) {
            if (typeof query[prop] === 'string') {
                formattedQuery[prop] = query[prop];
            }
            else if (typeof query[prop] !== 'undefined') {
                formattedQuery[prop] = String(query[prop]);
            }
        }
        return formattedQuery;
    }
    static autoDetectBodyType(url) {
        if (url.includes('.twitter.com/2')) {
            // Twitter API v2 always has JSON-encoded requests, right?
            return 'json';
        }
        if (url.startsWith('https://upload.twitter.com/1.1/media')) {
            return 'form-data';
        }
        const endpoint = url.split('.twitter.com/1.1/', 2)[1];
        if (this.JSON_1_1_ENDPOINTS.has(endpoint)) {
            return 'json';
        }
        return 'url';
    }
    static constructGetParams(query) {
        if (Object.keys(query).length)
            return '?' + new url_1.URLSearchParams(query).toString();
        return '';
    }
    static constructBodyParams(body, headers, mode) {
        if (body instanceof Buffer) {
            return body;
        }
        if (mode === 'json') {
            headers['content-type'] = 'application/json;charset=UTF-8';
            return JSON.stringify(body);
        }
        else if (mode === 'url') {
            headers['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
            if (Object.keys(body).length)
                return new url_1.URLSearchParams(body).toString();
            return '';
        }
        else if (mode === 'raw') {
            throw new Error('You can only use raw body mode with Buffers. To give a string, use Buffer.from(str).');
        }
        else {
            const form = new form_data_helper_1.FormDataHelper();
            for (const parameter in body) {
                form.append(parameter, body[parameter]);
            }
            const formHeaders = form.getHeaders();
            headers['content-type'] = formHeaders['content-type'];
            return form.getBuffer();
        }
    }
    static setBodyLengthHeader(options, body) {
        var _a;
        options.headers = (_a = options.headers) !== null && _a !== void 0 ? _a : {};
        if (typeof body === 'string') {
            options.headers['content-length'] = Buffer.byteLength(body);
        }
        else {
            options.headers['content-length'] = body.length;
        }
    }
    static isOAuthSerializable(item) {
        return !(item instanceof Buffer);
    }
    static mergeQueryAndBodyForOAuth(query, body) {
        const parameters = {};
        for (const prop in query) {
            parameters[prop] = query[prop];
        }
        if (this.isOAuthSerializable(body)) {
            for (const prop in body) {
                const bodyProp = body[prop];
                if (this.isOAuthSerializable(bodyProp)) {
                    parameters[prop] = bodyProp;
                }
            }
        }
        return parameters;
    }
    static mergeUrlQueryIntoObject(url, query) {
        const urlObject = new URL(url);
        for (const [param, value] of urlObject.searchParams) {
            query[param] = value;
        }
        // Remove the query string
        return urlObject.href.slice(0, urlObject.href.length - urlObject.search.length);
    }
}
RequestParamHelpers.JSON_1_1_ENDPOINTS = new Set([
    'direct_messages/events/new',
    'direct_messages/welcome_messages/new',
    'direct_messages/welcome_messages/rules/new',
    'media/metadata/create',
    'collections/entries/curate',
]);
class RequestHandlerHelper {
    constructor(requestData) {
        this.requestData = requestData;
        this.responseData = '';
    }
    get href() {
        return this.requestData.url;
    }
    isFormEncodedEndpoint() {
        return this.href.startsWith(RequestHandlerHelper.FORM_ENCODED_ENDPOINTS);
    }
    getRateLimitFromResponse(res) {
        let rateLimit = undefined;
        if (res.headers['x-rate-limit-limit']) {
            rateLimit = {
                limit: Number(res.headers['x-rate-limit-limit']),
                remaining: Number(res.headers['x-rate-limit-remaining']),
                reset: Number(res.headers['x-rate-limit-reset']),
            };
        }
        return rateLimit;
    }
    createRequestError(error) {
        if (settings_1.TwitterApiV2Settings.debug) {
            console.log('Request network error:', error);
        }
        return new types_1.ApiRequestError('Request failed.', {
            request: this.req,
            error,
        });
    }
    formatV1Errors(errors) {
        return errors
            .map(({ code, message }) => `${message} (Twitter code ${code})`)
            .join(', ');
    }
    formatV2Error(error) {
        return `${error.title}: ${error.detail} (see ${error.type})`;
    }
    createResponseError({ res, data, rateLimit, code }) {
        var _a;
        if (settings_1.TwitterApiV2Settings.debug) {
            console.log('Request failed with code', code, ', data:', data, 'response headers:', res.headers);
        }
        // Errors formatting.
        let errorString = `Request failed with code ${code}`;
        if ((_a = data === null || data === void 0 ? void 0 : data.errors) === null || _a === void 0 ? void 0 : _a.length) {
            const errors = data.errors;
            if ('code' in errors[0]) {
                errorString += ' - ' + this.formatV1Errors(errors);
            }
            else {
                errorString += ' - ' + this.formatV2Error(data);
            }
        }
        return new types_1.ApiResponseError(errorString, {
            code,
            data,
            headers: res.headers,
            request: this.req,
            response: res,
            rateLimit,
        });
    }
    registerRequestErrorHandler(reject) {
        return (requestError) => {
            reject(this.createRequestError(requestError));
        };
    }
    registerResponseHandler(resolve, reject) {
        return (res) => {
            const rateLimit = this.getRateLimitFromResponse(res);
            // Register the response data
            res.on('data', chunk => this.responseData += chunk);
            res.on('end', () => {
                var _a;
                let data = this.responseData;
                // Auto parse if server responds with JSON body
                if (data.length && ((_a = res.headers['content-type']) === null || _a === void 0 ? void 0 : _a.includes('application/json'))) {
                    data = JSON.parse(data);
                }
                // f-e oauth token endpoints
                else if (this.isFormEncodedEndpoint()) {
                    const response_form_entries = {};
                    for (const [item, value] of new url_1.URLSearchParams(data)) {
                        response_form_entries[item] = value;
                    }
                    data = response_form_entries;
                }
                // Handle bad error codes
                const code = res.statusCode;
                if (code >= 400) {
                    reject(this.createResponseError({ data, res, rateLimit, code }));
                }
                resolve({
                    data,
                    headers: res.headers,
                    rateLimit
                });
            });
        };
    }
    registerStreamResponseHandler(resolve, reject) {
        return (res) => {
            const code = res.statusCode;
            if (code < 400) {
                // HTTP code ok, consume stream
                resolve({ req: this.req, res, requestData: this.requestData });
            }
            else {
                // Handle response normally, can only rejects
                this.registerResponseHandler(() => undefined, reject)(res);
            }
        };
    }
    debugRequest() {
        console.log('Request to', this.requestData.url, 'will be made.', 'Options:', this.requestData.options, 'body:', this.requestData.body);
    }
    buildRequest() {
        if (settings_1.TwitterApiV2Settings.debug) {
            this.debugRequest();
        }
        this.req = https_1.request(this.requestData.url, this.requestData.options);
    }
    makeRequest() {
        this.buildRequest();
        return new Promise((resolve, reject) => {
            const req = this.req;
            // Handle request errors
            req.on('error', this.registerRequestErrorHandler(reject));
            req.on('response', this.registerResponseHandler(resolve, reject));
            if (this.requestData.body) {
                req.write(this.requestData.body);
            }
            req.end();
        });
    }
    async makeRequestAsStream() {
        const { req, res, requestData } = await this.makeRequestAndResolveWhenReady();
        return new TweetStream_1.default(req, res, requestData);
    }
    makeRequestAndResolveWhenReady() {
        this.buildRequest();
        return new Promise((resolve, reject) => {
            const req = this.req;
            // Handle request errors
            req.on('error', this.registerRequestErrorHandler(reject));
            req.on('response', this.registerStreamResponseHandler(resolve, reject));
            if (this.requestData.body) {
                req.write(this.requestData.body);
            }
            req.end();
        });
    }
}
exports.RequestHandlerHelper = RequestHandlerHelper;
RequestHandlerHelper.FORM_ENCODED_ENDPOINTS = 'https://api.twitter.com/oauth/';
