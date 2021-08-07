/// <reference types="node" />
import { ApiRequestError, ApiResponseError, ErrorV1, ErrorV2, TwitterRateLimit, TwitterResponse } from '../types';
import TweetStream from '../stream/TweetStream';
import { RequestOptions } from 'https';
import type { ClientRequest, IncomingMessage } from 'http';
import OAuth1Helper from './oauth1.helper';
export declare type TRequestFullData = {
    url: string;
    options: RequestOptions;
    body?: any;
};
export declare type TRequestQuery = Record<string, string | number | boolean | string[] | undefined>;
export declare type TRequestStringQuery = Record<string, string>;
export declare type TRequestBody = Record<string, any> | Buffer;
export declare type TBodyMode = 'json' | 'url' | 'form-data' | 'raw';
interface IWriteAuthHeadersArgs {
    headers: Record<string, string>;
    bodyInSignature: boolean;
    url: string;
    method: string;
    query: TRequestQuery;
    body: TRequestBody;
}
export interface IGetHttpRequestArgs {
    url: string;
    method: string;
    query?: TRequestQuery;
    body?: TRequestBody;
    headers?: Record<string, string>;
    forceBodyMode?: TBodyMode;
}
export declare type TCustomizableRequestArgs = Pick<IGetHttpRequestArgs, 'headers' | 'forceBodyMode'>;
export declare abstract class ClientRequestMaker {
    protected _bearerToken?: string;
    protected _consumerToken?: string;
    protected _consumerSecret?: string;
    protected _accessToken?: string;
    protected _accessSecret?: string;
    protected _basicToken?: string;
    protected _oauth?: OAuth1Helper;
    protected static readonly BODY_METHODS: Set<string>;
    /**
     * Send a new request and returns a wrapped `Promise<TwitterResponse<T>`.
     *
     * The request URL should not contains a query string, prefers using `parameters` for GET request.
     * If you need to pass a body AND query string parameter, duplicate parameters in the body.
     */
    send<T = any>(options: IGetHttpRequestArgs): Promise<TwitterResponse<T>>;
    /**
     * Send a new request, then creates a stream from its as a `Promise<TwitterStream>`.
     *
     * The request URL should not contains a query string, prefers using `parameters` for GET request.
     * If you need to pass a body AND query string parameter, duplicate parameters in the body.
     */
    sendStream<T = any>(options: IGetHttpRequestArgs): Promise<TweetStream<T>>;
    protected buildOAuth(): OAuth1Helper;
    protected getOAuthAccessTokens(): {
        key: string;
        secret: string;
    } | undefined;
    protected writeAuthHeaders({ headers, bodyInSignature, url, method, query, body }: IWriteAuthHeadersArgs): Record<string, string>;
    protected getHttpRequestArgs({ url, method, query: rawQuery, body: rawBody, headers, forceBodyMode }: IGetHttpRequestArgs): {
        url: string;
        method: string;
        headers: Record<string, string>;
        body: string | Buffer | undefined;
    };
    protected httpSend<T = any>(url: string, options: RequestOptions, body?: string | Buffer): Promise<TwitterResponse<T>>;
    protected httpStream<T = any>(url: string, options: RequestOptions, body?: string | Buffer): Promise<TweetStream>;
}
declare type TRequestReadyPayload = {
    req: ClientRequest;
    res: IncomingMessage;
    requestData: TRequestFullData;
};
declare type TReadyRequestResolver = (value: TRequestReadyPayload) => void;
declare type TResponseResolver<T> = (value: TwitterResponse<T>) => void;
declare type TRequestRejecter = (error: ApiRequestError) => void;
declare type TResponseRejecter = (error: ApiResponseError) => void;
interface IBuildErrorParams {
    res: IncomingMessage;
    data: any;
    rateLimit?: TwitterRateLimit;
    code: number;
}
export declare class RequestHandlerHelper<T> {
    protected requestData: TRequestFullData;
    protected static readonly FORM_ENCODED_ENDPOINTS = "https://api.twitter.com/oauth/";
    protected req: ClientRequest;
    protected responseData: string;
    constructor(requestData: TRequestFullData);
    get href(): string;
    protected isFormEncodedEndpoint(): boolean;
    protected getRateLimitFromResponse(res: IncomingMessage): TwitterRateLimit | undefined;
    protected createRequestError(error: Error): ApiRequestError;
    protected formatV1Errors(errors: ErrorV1[]): string;
    protected formatV2Error(error: ErrorV2): string;
    protected createResponseError({ res, data, rateLimit, code }: IBuildErrorParams): ApiResponseError;
    protected registerRequestErrorHandler(reject: TRequestRejecter): (requestError: Error) => void;
    protected registerResponseHandler(resolve: TResponseResolver<T>, reject: TResponseRejecter): (res: IncomingMessage) => void;
    protected registerStreamResponseHandler(resolve: TReadyRequestResolver, reject: TResponseRejecter): (res: IncomingMessage) => void;
    protected debugRequest(): void;
    protected buildRequest(): void;
    makeRequest(): Promise<TwitterResponse<T>>;
    makeRequestAsStream(): Promise<TweetStream<T>>;
    makeRequestAndResolveWhenReady(): Promise<TRequestReadyPayload>;
}
export {};
