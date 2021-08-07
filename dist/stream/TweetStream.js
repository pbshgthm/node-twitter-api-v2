"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetStream = void 0;
const events_1 = require("events");
const request_maker_mixin_1 = require("../client-mixins/request-maker.mixin");
const types_1 = require("../types");
const TweetStreamParser_1 = __importStar(require("./TweetStreamParser"));
class TweetStream extends events_1.EventEmitter {
    constructor(req, res, requestData) {
        super();
        this.req = req;
        this.res = res;
        this.requestData = requestData;
        this.autoReconnect = false;
        this.autoReconnectRetries = 5;
        this.parser = new TweetStreamParser_1.default();
        this.initEventsFromParser();
        this.initEventsFromRequest();
    }
    on(event, handler) {
        return super.on(event, handler);
    }
    initEventsFromRequest() {
        const errorHandler = (err) => {
            this.emit(types_1.ETwitterStreamEvent.ConnectionError, err);
            this.emit(types_1.ETwitterStreamEvent.Error, {
                type: types_1.ETwitterStreamEvent.ConnectionError,
                error: err,
            });
            this.onConnectionError();
        };
        this.req.on('error', errorHandler);
        this.res.on('error', errorHandler);
        this.res.on('close', () => {
            this.close();
        });
        this.res.on('data', (chunk) => {
            if (chunk.toString() === '\r\n') {
                return this.emit(types_1.ETwitterStreamEvent.DataKeepAlive);
            }
            this.parser.push(chunk.toString());
        });
    }
    initEventsFromParser() {
        this.parser.on(TweetStreamParser_1.EStreamParserEvent.ParsedData, (eventData) => {
            this.emit(types_1.ETwitterStreamEvent.Data, eventData);
        });
        this.parser.on(TweetStreamParser_1.EStreamParserEvent.ParseError, (error) => {
            this.emit(types_1.ETwitterStreamEvent.TweetParseError, error);
            this.emit(types_1.ETwitterStreamEvent.Error, {
                type: types_1.ETwitterStreamEvent.TweetParseError,
                error,
            });
        });
    }
    unbindRetryTimeout() {
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
            this.retryTimeout = undefined;
        }
    }
    /** Terminate connection to Twitter. */
    close() {
        this.unbindRetryTimeout();
        this.emit(types_1.ETwitterStreamEvent.ConnectionClosed);
        if ('destroy' in this.req) {
            this.req.destroy();
        }
        else {
            // Deprecated - use .destroy instead.
            this.req.abort();
        }
        this.req.removeAllListeners();
        this.res.removeAllListeners();
    }
    /** Unbind all listeners, and close connection. */
    destroy() {
        this.removeAllListeners();
        this.close();
    }
    /**
     * Make a new request that creates a new `TweetStream` instance with
     * the same parameters, and bind current listeners to new stream.
     */
    async clone() {
        const newRequest = new request_maker_mixin_1.RequestHandlerHelper(this.requestData);
        const newStream = await newRequest.makeRequestAsStream();
        // Clone attached listeners
        const listenerNames = this.eventNames();
        for (const listener of listenerNames) {
            const callbacks = this.listeners(listener);
            for (const callback of callbacks) {
                newStream.on(listener, callback);
            }
        }
        return newStream;
    }
    /** Make a new request to reconnect to Twitter. */
    async reconnect() {
        if (!this.req.destroyed) {
            this.close();
        }
        const { req, res } = await new request_maker_mixin_1.RequestHandlerHelper(this.requestData).makeRequestAndResolveWhenReady();
        this.req = req;
        this.res = res;
        this.initEventsFromRequest();
    }
    async onConnectionError(retries = this.autoReconnectRetries) {
        this.unbindRetryTimeout();
        if (!this.autoReconnect) {
            return;
        }
        // Request is already destroyed
        if (this.req.destroyed) {
            return;
        }
        // Close connection silentely
        if ('destroy' in this.req) {
            this.req.destroy();
        }
        else {
            // Deprecated - use .destroy instead.
            this.req.abort();
        }
        try {
            await this.reconnect();
        }
        catch (e) {
            if (retries <= 0) {
                this.emit(types_1.ETwitterStreamEvent.ReconnectLimitExceeded);
                return;
            }
            this.emit(types_1.ETwitterStreamEvent.ReconnectError, this.autoReconnectRetries - retries);
            this.makeAutoReconnectRetry(retries);
        }
    }
    makeAutoReconnectRetry(retries) {
        const tryOccurence = (this.autoReconnectRetries - retries) + 1;
        const nextRetry = Math.min((tryOccurence ** 2) * 100, 20000);
        this.retryTimeout = setTimeout(() => {
            this.onConnectionError(retries - 1);
        }, nextRetry);
    }
    async *[Symbol.asyncIterator]() {
        let stack = [];
        const pusher = (data) => {
            stack.push(data);
        };
        this.on(types_1.ETwitterStreamEvent.Data, pusher);
        try {
            while (true) {
                if (this.req.aborted) {
                    throw new Error('Connection closed');
                }
                if (stack.length) {
                    const toGive = stack;
                    stack = [];
                    yield* toGive;
                }
                await new Promise((resolve, reject) => {
                    const rejecter = (error) => {
                        this.off(types_1.ETwitterStreamEvent.Data, resolver);
                        reject(error);
                    };
                    const resolver = (data) => {
                        this.off(types_1.ETwitterStreamEvent.Error, rejecter);
                        this.off(types_1.ETwitterStreamEvent.ConnectionClosed, rejecter);
                        resolve(data);
                    };
                    this.once(types_1.ETwitterStreamEvent.Data, resolver);
                    this.once(types_1.ETwitterStreamEvent.Error, rejecter);
                    this.once(types_1.ETwitterStreamEvent.ConnectionClosed, rejecter);
                });
            }
        }
        finally {
            this.off(types_1.ETwitterStreamEvent.Data, pusher);
        }
    }
}
exports.TweetStream = TweetStream;
exports.default = TweetStream;
