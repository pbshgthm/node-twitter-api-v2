"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_subclient_1 = __importDefault(require("../client.subclient"));
const globals_1 = require("../globals");
const paginators_1 = require("../paginators");
const client_v2_labs_read_1 = __importDefault(require("../v2-labs/client.v2.labs.read"));
/**
 * Base Twitter v2 client with only read right.
 */
class TwitterApiv2ReadOnly extends client_subclient_1.default {
    constructor() {
        super(...arguments);
        this._prefix = globals_1.API_V2_PREFIX;
    }
    /* Sub-clients */
    /**
     * Get a client for v2 labs endpoints.
     */
    get labs() {
        if (this._labs)
            return this._labs;
        return this._labs = new client_v2_labs_read_1.default(this);
    }
    /* Tweets */
    /**
     * The recent search endpoint returns Tweets from the last seven days that match a search query.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-recent
     */
    async search(query, options = {}) {
        const queryParams = { ...options, query };
        const initialRq = await this.get('tweets/search/recent', queryParams, { fullResponse: true });
        return new paginators_1.TweetSearchRecentV2Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * The full-archive search endpoint returns the complete history of public Tweets matching a search query;
     * since the first Tweet was created March 26, 2006.
     *
     * This endpoint is only available to those users who have been approved for the Academic Research product track.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-all
     */
    async searchAll(query, options = {}) {
        const queryParams = { ...options, query };
        const initialRq = await this.get('tweets/search/all', queryParams, { fullResponse: true });
        return new paginators_1.TweetSearchAllV2Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns a variety of information about a single Tweet specified by the requested ID.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/lookup/api-reference/get-tweets-id
     */
    singleTweet(tweetId, options = {}) {
        return this.get(`tweets/${tweetId}`, options);
    }
    /**
     * Returns a variety of information about tweets specified by list of IDs.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/lookup/api-reference/get-tweets
     */
    tweets(tweetIds, options = {}) {
        return this.get('tweets', { ids: tweetIds, ...options });
    }
    /**
     * Returns Tweets composed by a single user, specified by the requested user ID.
     * By default, the most recent ten Tweets are returned per request.
     * Using pagination, the most recent 3,200 Tweets can be retrieved.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-tweets
     */
    async userTimeline(userId, options = {}) {
        const initialRq = await this.get(`users/${userId}/tweets`, options, { fullResponse: true });
        return new paginators_1.TweetUserTimelineV2Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams: options,
            sharedParams: { userId },
        });
    }
    /**
     * Returns Tweets mentioning a single user specified by the requested user ID.
     * By default, the most recent ten Tweets are returned per request.
     * Using pagination, up to the most recent 800 Tweets can be retrieved.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-mentions
     */
    async userMentionTimeline(userId, options = {}) {
        const initialRq = await this.get(`users/${userId}/mentions`, options, { fullResponse: true });
        return new paginators_1.TweetUserMentionTimelineV2Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams: options,
            sharedParams: { userId },
        });
    }
    /* Users */
    /**
     * Returns a variety of information about a single user specified by the requested ID.
     * https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-id
     */
    user(userId, options = {}) {
        return this.get(`users/${userId}`, options);
    }
    /**
     * Returns a variety of information about one or more users specified by the requested IDs.
     * https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users
     */
    users(userIds, options = {}) {
        const ids = Array.isArray(userIds) ? userIds.join(',') : userIds;
        return this.get('users', { ...options, ids });
    }
    /**
     * Returns a variety of information about a single user specified by their username.
     * https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-by-username-username
     */
    userByUsername(username, options = {}) {
        return this.get(`users/by/username/${username}`, options);
    }
    /**
     * Returns a variety of information about one or more users specified by their usernames.
     * https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-by
     */
    usersByUsernames(usernames, options = {}) {
        usernames = Array.isArray(usernames) ? usernames.join(',') : usernames;
        return this.get('users/by', { ...options, usernames });
    }
    /**
     * Returns a list of users who are followers of the specified user ID.
     * https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/get-users-id-followers
     */
    followers(userId, options = {}) {
        return this.get(`users/${userId}/followers`, options);
    }
    /**
     * Returns a list of users the specified user ID is following.
     * https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/get-users-id-following
     */
    following(userId, options = {}) {
        return this.get(`users/${userId}/following`, options);
    }
    /* Streaming API */
    /**
     * Streams Tweets in real-time based on a specific set of filter rules.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/api-reference/get-tweets-search-stream
     */
    searchStream(options = {}) {
        return this.getStream('tweets/search/stream', options);
    }
    /**
     * Return a list of rules currently active on the streaming endpoint, either as a list or individually.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/api-reference/get-tweets-search-stream-rules
     */
    streamRules(options = {}) {
        return this.get('tweets/search/stream/rules', options);
    }
    updateStreamRules(options, query = {}) {
        return this.post('tweets/search/stream/rules', options, { query });
    }
    /**
     * Streams about 1% of all Tweets in real-time.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/sampled-stream/api-reference/get-tweets-sample-stream
     */
    sampleStream(options = {}) {
        return this.getStream('tweets/sample/stream', options);
    }
}
exports.default = TwitterApiv2ReadOnly;
