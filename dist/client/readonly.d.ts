import TwitterApi from '.';
import TwitterApiBase from '../client.base';
import type { LoginResult, RequestTokenArgs, Tweetv2SearchParams } from '../types';
import TwitterApiv1ReadOnly from '../v1/client.v1.read';
import TwitterApiv2ReadOnly from '../v2/client.v2.read';
import { UserV1 } from '../types';
/**
 * Twitter v1.1 and v2 API client.
 */
export default class TwitterApiReadOnly extends TwitterApiBase {
    protected _v1?: TwitterApiv1ReadOnly;
    protected _v2?: TwitterApiv2ReadOnly;
    protected _currentUser?: UserV1;
    get v1(): TwitterApiv1ReadOnly;
    get v2(): TwitterApiv2ReadOnly;
    /**
     * Fetch and cache current user.
     * This method can only be called with a OAuth 1.0a user authentification.
     *
     * You can use this method to test if authentification was successful.
     * Next calls to this methods will use the cached user, unless `forceFetch: true` is given.
     */
    currentUser(forceFetch?: boolean): Promise<UserV1>;
    search(what: string, options?: Partial<Tweetv2SearchParams>): Promise<import("..").TweetSearchRecentV2Paginator>;
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
    generateAuthLink(oauth_callback?: string, { authAccessType, linkMode }?: Partial<RequestTokenArgs>): Promise<{
        oauth_token: string;
        oauth_token_secret: string;
        oauth_callback_confirmed: "true";
        url: string;
    }>;
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
    login(oauth_verifier: string): Promise<LoginResult>;
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
    appLogin(): Promise<TwitterApi>;
}
