import TwitterApiSubClient from '../client.subclient';
import { FollowersV2Result, FollowersV2Params, Tweetv2FieldsParams, Tweetv2SearchParams, UserV2Result, UsersV2Result, UsersV2Params, StreamingV2GetRulesParams, StreamingV2GetRulesResult, TweetV2LookupResult, TweetV2UserTimelineParams, StreamingV2AddRulesParams, StreamingV2DeleteRulesParams, StreamingV2UpdateRulesQuery, StreamingV2UpdateRulesDeleteResult, StreamingV2UpdateRulesAddResult, TweetV2SingleResult, TweetV2PaginableTimelineParams } from '../types';
import { TweetSearchAllV2Paginator, TweetSearchRecentV2Paginator, TweetUserMentionTimelineV2Paginator, TweetUserTimelineV2Paginator } from '../paginators';
import TwitterApiv2LabsReadOnly from '../v2-labs/client.v2.labs.read';
/**
 * Base Twitter v2 client with only read right.
 */
export default class TwitterApiv2ReadOnly extends TwitterApiSubClient {
    protected _prefix: string;
    protected _labs?: TwitterApiv2LabsReadOnly;
    /**
     * Get a client for v2 labs endpoints.
     */
    get labs(): TwitterApiv2LabsReadOnly;
    /**
     * The recent search endpoint returns Tweets from the last seven days that match a search query.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-recent
     */
    search(query: string, options?: Partial<Tweetv2SearchParams>): Promise<TweetSearchRecentV2Paginator>;
    /**
     * The full-archive search endpoint returns the complete history of public Tweets matching a search query;
     * since the first Tweet was created March 26, 2006.
     *
     * This endpoint is only available to those users who have been approved for the Academic Research product track.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-all
     */
    searchAll(query: string, options?: Partial<Tweetv2SearchParams>): Promise<TweetSearchAllV2Paginator>;
    /**
     * Returns a variety of information about a single Tweet specified by the requested ID.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/lookup/api-reference/get-tweets-id
     */
    singleTweet(tweetId: string, options?: Partial<Tweetv2FieldsParams>): Promise<TweetV2SingleResult>;
    /**
     * Returns a variety of information about tweets specified by list of IDs.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/lookup/api-reference/get-tweets
     */
    tweets(tweetIds: string | string[], options?: Partial<Tweetv2FieldsParams>): Promise<TweetV2LookupResult>;
    /**
     * Returns Tweets composed by a single user, specified by the requested user ID.
     * By default, the most recent ten Tweets are returned per request.
     * Using pagination, the most recent 3,200 Tweets can be retrieved.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-tweets
     */
    userTimeline(userId: string, options?: Partial<TweetV2UserTimelineParams>): Promise<TweetUserTimelineV2Paginator>;
    /**
     * Returns Tweets mentioning a single user specified by the requested user ID.
     * By default, the most recent ten Tweets are returned per request.
     * Using pagination, up to the most recent 800 Tweets can be retrieved.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-mentions
     */
    userMentionTimeline(userId: string, options?: Partial<TweetV2PaginableTimelineParams>): Promise<TweetUserMentionTimelineV2Paginator>;
    /**
     * Returns a variety of information about a single user specified by the requested ID.
     * https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-id
     */
    user(userId: string, options?: Partial<UsersV2Params>): Promise<UserV2Result>;
    /**
     * Returns a variety of information about one or more users specified by the requested IDs.
     * https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users
     */
    users(userIds: string | string[], options?: Partial<UsersV2Params>): Promise<UsersV2Result>;
    /**
     * Returns a variety of information about a single user specified by their username.
     * https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-by-username-username
     */
    userByUsername(username: string, options?: Partial<UsersV2Params>): Promise<UserV2Result>;
    /**
     * Returns a variety of information about one or more users specified by their usernames.
     * https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-by
     */
    usersByUsernames(usernames: string | string[], options?: Partial<UsersV2Params>): Promise<UsersV2Result>;
    /**
     * Returns a list of users who are followers of the specified user ID.
     * https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/get-users-id-followers
     */
    followers(userId: string, options?: Partial<FollowersV2Params>): Promise<FollowersV2Result>;
    /**
     * Returns a list of users the specified user ID is following.
     * https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/get-users-id-following
     */
    following(userId: string, options?: Partial<FollowersV2Params>): Promise<FollowersV2Result>;
    /**
     * Streams Tweets in real-time based on a specific set of filter rules.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/api-reference/get-tweets-search-stream
     */
    searchStream(options?: Partial<Tweetv2FieldsParams>): Promise<import("..").TweetStream<TweetV2SingleResult>>;
    /**
     * Return a list of rules currently active on the streaming endpoint, either as a list or individually.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/api-reference/get-tweets-search-stream-rules
     */
    streamRules(options?: Partial<StreamingV2GetRulesParams>): Promise<StreamingV2GetRulesResult>;
    /**
     * Add or delete rules to your stream.
     * To create one or more rules, submit an add JSON body with an array of rules and operators.
     * Similarly, to delete one or more rules, submit a delete JSON body with an array of list of existing rule IDs.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/api-reference/post-tweets-search-stream-rules
     */
    updateStreamRules(options: StreamingV2AddRulesParams, query?: Partial<StreamingV2UpdateRulesQuery>): Promise<StreamingV2UpdateRulesAddResult>;
    updateStreamRules(options: StreamingV2DeleteRulesParams, query?: Partial<StreamingV2UpdateRulesQuery>): Promise<StreamingV2UpdateRulesDeleteResult>;
    /**
     * Streams about 1% of all Tweets in real-time.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/sampled-stream/api-reference/get-tweets-sample-stream
     */
    sampleStream(options?: Partial<Tweetv2FieldsParams>): Promise<import("..").TweetStream<TweetV2SingleResult>>;
}
