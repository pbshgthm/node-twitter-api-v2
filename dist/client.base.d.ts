import { TClientTokens, TwitterApiBasicAuth, TwitterApiTokens, TwitterResponse } from './types';
import { ClientRequestMaker, TCustomizableRequestArgs, TRequestBody, TRequestQuery } from './client-mixins/request-maker.mixin';
import TweetStream from './stream/TweetStream';
export declare type TGetClientRequestArgs = TCustomizableRequestArgs & {
    prefix?: string;
    fullResponse?: boolean;
};
declare type TGetClientRequestArgsFullResponse = TClientRequestArgs & {
    fullResponse: true;
};
declare type TGetClientRequestArgsDataResponse = TClientRequestArgs & {
    fullResponse?: false;
};
export declare type TClientRequestArgs = TCustomizableRequestArgs & {
    prefix?: string;
    fullResponse?: boolean;
    query?: TRequestQuery;
};
declare type TClientRequestArgsFullResponse = TClientRequestArgs & {
    fullResponse: true;
};
declare type TClientRequestArgsDataResponse = TClientRequestArgs & {
    fullResponse?: false;
};
export declare type TStreamClientRequestArgs = TCustomizableRequestArgs & {
    prefix?: string;
    query?: TRequestQuery;
};
/**
 * Base class for Twitter instances
 */
export default abstract class TwitterApiBase extends ClientRequestMaker {
    protected _prefix: string | undefined;
    /**
     * Create a new TwitterApi object without authentification.
     */
    constructor();
    /**
     * Create a new TwitterApi object with OAuth 2.0 Bearer authentification.
     */
    constructor(bearerToken: string);
    /**
     * Create a new TwitterApi object with three-legged OAuth 1.0a authentification.
     */
    constructor(tokens: TwitterApiTokens);
    /**
     * Create a new TwitterApi object with Basic HTTP authentification.
     */
    constructor(credentials: TwitterApiBasicAuth);
    /**
     * Create a clone of {instance}.
     */
    constructor(instance: TwitterApiBase);
    protected setPrefix(prefix: string | undefined): void;
    cloneWithPrefix(prefix: string): this;
    getActiveTokens(): TClientTokens;
    get<T = any>(url: string, query?: TRequestQuery, args?: TGetClientRequestArgsDataResponse): Promise<T>;
    get<T = any>(url: string, query?: TRequestQuery, args?: TGetClientRequestArgsFullResponse): Promise<TwitterResponse<T>>;
    delete<T = any>(url: string, query?: TRequestQuery, args?: TGetClientRequestArgsDataResponse): Promise<T>;
    delete<T = any>(url: string, query?: TRequestQuery, args?: TGetClientRequestArgsFullResponse): Promise<TwitterResponse<T>>;
    post<T = any>(url: string, body?: TRequestBody, args?: TClientRequestArgsDataResponse): Promise<T>;
    post<T = any>(url: string, body?: TRequestBody, args?: TClientRequestArgsFullResponse): Promise<TwitterResponse<T>>;
    put<T = any>(url: string, body?: TRequestBody, args?: TClientRequestArgsDataResponse): Promise<T>;
    put<T = any>(url: string, body?: TRequestBody, args?: TClientRequestArgsFullResponse): Promise<TwitterResponse<T>>;
    patch<T = any>(url: string, body?: TRequestBody, args?: TClientRequestArgsDataResponse): Promise<T>;
    patch<T = any>(url: string, body?: TRequestBody, args?: TClientRequestArgsFullResponse): Promise<TwitterResponse<T>>;
    /** Stream request helpers */
    getStream<T = any>(url: string, query?: TRequestQuery, { prefix }?: TStreamClientRequestArgs): Promise<TweetStream<T>>;
    deleteStream<T = any>(url: string, query?: TRequestQuery, { prefix }?: TStreamClientRequestArgs): Promise<TweetStream<T>>;
    postStream<T = any>(url: string, body?: TRequestBody, { prefix, ...rest }?: TStreamClientRequestArgs): Promise<TweetStream<T>>;
    putStream<T = any>(url: string, body?: TRequestBody, { prefix, ...rest }?: TStreamClientRequestArgs): Promise<TweetStream<T>>;
    patchStream<T = any>(url: string, body?: TRequestBody, { prefix, ...rest }?: TStreamClientRequestArgs): Promise<TweetStream<T>>;
}
export {};
