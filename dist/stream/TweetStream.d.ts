/// <reference types="node" />
import { EventEmitter } from 'events';
import type { IncomingMessage, ClientRequest } from 'http';
import { TRequestFullData } from '../client-mixins/request-maker.mixin';
import { ETwitterStreamEvent } from '../types';
import TweetStreamParser from './TweetStreamParser';
interface ITweetStreamError {
    type: ETwitterStreamEvent.ConnectionError | ETwitterStreamEvent.TweetParseError;
    error: Error;
}
export declare class TweetStream<T = any> extends EventEmitter {
    protected req: ClientRequest;
    protected res: IncomingMessage;
    protected requestData: TRequestFullData;
    autoReconnect: boolean;
    autoReconnectRetries: number;
    protected retryTimeout?: NodeJS.Timeout;
    protected parser: TweetStreamParser;
    constructor(req: ClientRequest, res: IncomingMessage, requestData: TRequestFullData);
    on(event: ETwitterStreamEvent.Data, handler: (data: T) => any): this;
    on(event: ETwitterStreamEvent.Error, handler: (errorPayload: ITweetStreamError) => any): this;
    on(event: ETwitterStreamEvent.ConnectionError, handler: (error: Error) => any): this;
    on(event: ETwitterStreamEvent.TweetParseError, handler: (error: Error) => any): this;
    on(event: ETwitterStreamEvent.ConnectionClosed, handler: () => any): this;
    on(event: ETwitterStreamEvent.DataKeepAlive, handler: () => any): this;
    on(event: ETwitterStreamEvent.ReconnectError, handler: (tries: number) => any): this;
    on(event: ETwitterStreamEvent.ReconnectLimitExceeded, handler: () => any): this;
    on(event: string | symbol, handler: (...args: any[]) => any): this;
    protected initEventsFromRequest(): void;
    protected initEventsFromParser(): void;
    protected unbindRetryTimeout(): void;
    /** Terminate connection to Twitter. */
    close(): void;
    /** Unbind all listeners, and close connection. */
    destroy(): void;
    /**
     * Make a new request that creates a new `TweetStream` instance with
     * the same parameters, and bind current listeners to new stream.
     */
    clone(): Promise<TweetStream<unknown>>;
    /** Make a new request to reconnect to Twitter. */
    reconnect(): Promise<void>;
    protected onConnectionError(retries?: number): Promise<void>;
    protected makeAutoReconnectRetry(retries: number): void;
    [Symbol.asyncIterator](): AsyncGenerator<T, void, undefined>;
}
export default TweetStream;
