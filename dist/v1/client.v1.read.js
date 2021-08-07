"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_subclient_1 = __importDefault(require("../client.subclient"));
const globals_1 = require("../globals");
const helpers_1 = require("../helpers");
const client_v1_1 = __importDefault(require("../v1/client.v1"));
const tweet_paginator_v1_1 = require("../paginators/tweet.paginator.v1");
/**
 * Base Twitter v1 client with only read right.
 */
class TwitterApiv1ReadOnly extends client_subclient_1.default {
    constructor() {
        super(...arguments);
        this._prefix = globals_1.API_V1_1_PREFIX;
    }
    /* Tweets timelines */
    /**
     * Returns a collection of the most recent Tweets and Retweets posted by the authenticating user and the users they follow.
     * The home timeline is central to how most users interact with the Twitter service.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-home_timeline
     */
    async homeTimeline(options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('statuses/home_timeline.json', queryParams, { fullResponse: true });
        return new tweet_paginator_v1_1.HomeTimelineV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns the 20 most recent mentions (Tweets containing a users's @screen_name) for the authenticating user.
     * The timeline returned is the equivalent of the one seen when you view your mentions on twitter.com.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-mentions_timeline
     */
    async mentionTimeline(options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            ...options,
        };
        const initialRq = await this.get('statuses/mentions_timeline.json', queryParams, { fullResponse: true });
        return new tweet_paginator_v1_1.MentionTimelineV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns a collection of the most recent Tweets posted by the user indicated by the user_id parameters.
     * User timelines belonging to protected users may only be requested when the authenticated user either "owns" the timeline or is an approved follower of the owner.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-user_timeline
     */
    async userTimeline(userId, options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            user_id: userId,
            ...options,
        };
        const initialRq = await this.get('statuses/user_timeline.json', queryParams, { fullResponse: true });
        return new tweet_paginator_v1_1.UserTimelineV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /**
     * Returns a collection of the most recent Tweets posted by the user indicated by the screen_name parameters.
     * User timelines belonging to protected users may only be requested when the authenticated user either "owns" the timeline or is an approved follower of the owner.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-user_timeline
     */
    async userTimelineByUsername(username, options = {}) {
        const queryParams = {
            tweet_mode: 'extended',
            screen_name: username,
            ...options,
        };
        const initialRq = await this.get('statuses/user_timeline.json', queryParams, { fullResponse: true });
        return new tweet_paginator_v1_1.UserTimelineV1Paginator({
            realData: initialRq.data,
            rateLimit: initialRq.rateLimit,
            instance: this,
            queryParams,
        });
    }
    /* Users */
    /**
     * Returns an HTTP 200 OK response code and a representation of the requesting user if authentication was successful;
     * returns a 401 status code and an error message if not.
     * Use this method to test if supplied user credentials are valid.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/manage-account-settings/api-reference/get-account-verify_credentials
     */
    verifyCredentials(options = {}) {
        return this.get('account/verify_credentials.json', options);
    }
    /* Media upload API */
    /**
     * The STATUS command (this method) is used to periodically poll for updates of media processing operation.
     * After the STATUS command response returns succeeded, you can move on to the next step which is usually create Tweet with media_id.
     * https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/api-reference/get-media-upload-status
     */
    mediaInfo(mediaId) {
        return this.get('media/upload.json', {
            command: 'STATUS',
            media_id: mediaId,
        }, { prefix: globals_1.API_V1_1_UPLOAD_PREFIX });
    }
    /* Streaming API */
    /**
     * Returns public statuses that match one or more filter predicates.
     * Multiple parameters may be specified which allows most clients to use a single connection to the Streaming API.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/filter-realtime/api-reference/post-statuses-filter
     */
    filterStream(params = {}) {
        const parameters = {};
        for (const [key, value] of Object.entries(params)) {
            if (key === 'follow' || key === 'track') {
                parameters[key] = value.toString();
            }
            else if (key === 'locations') {
                const locations = value;
                parameters.locations = helpers_1.arrayWrap(locations).map(loc => `${loc.lng},${loc.lat}`).join(',');
            }
            else {
                parameters[key] = value;
            }
        }
        const streamClient = this.stream;
        return streamClient.postStream('statuses/filter.json', parameters);
    }
    /**
     * Returns a small random sample of all public statuses.
     * The Tweets returned by the default access level are the same, so if two different clients connect to this endpoint, they will see the same Tweets.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/sample-realtime/api-reference/get-statuses-sample
     */
    sampleStream(params = {}) {
        const streamClient = this.stream;
        return streamClient.getStream('statuses/sample.json', params);
    }
    /**
     * Create a client that is prefixed with `https//stream.twitter.com` instead of classic API URL.
     */
    get stream() {
        const copiedClient = new client_v1_1.default(this);
        copiedClient.setPrefix(globals_1.API_V1_1_STREAM_PREFIX);
        return copiedClient;
    }
    /* Trends API */
    /**
     * Returns the top 50 trending topics for a specific id, if trending information is available for it.
     * Note: The id parameter for this endpoint is the "where on earth identifier" or WOEID, which is a legacy identifier created by Yahoo and has been deprecated.
     * https://developer.twitter.com/en/docs/twitter-api/v1/trends/trends-for-location/api-reference/get-trends-place
     */
    trendsByPlace(woeId, options = {}) {
        return this.get('trends/place.json', { id: woeId, ...options });
    }
    /**
     * Returns the locations that Twitter has trending topic information for.
     * The response is an array of "locations" that encode the location's WOEID
     * and some other human-readable information such as a canonical name and country the location belongs in.
     * https://developer.twitter.com/en/docs/twitter-api/v1/trends/locations-with-trending-topics/api-reference/get-trends-available
     */
    trendsAvailable() {
        return this.get('trends/available.json');
    }
    /**
     * Returns the locations that Twitter has trending topic information for, closest to a specified location.
     * https://developer.twitter.com/en/docs/twitter-api/v1/trends/locations-with-trending-topics/api-reference/get-trends-closest
     */
    trendsClosest(lat, long) {
        return this.get('trends/closest.json', { lat, long });
    }
    /* Geo API */
    /**
     * Returns all the information about a known place.
     * https://developer.twitter.com/en/docs/twitter-api/v1/geo/place-information/api-reference/get-geo-id-place_id
     */
    geoPlace(placeId) {
        return this.get(`geo/id/${placeId}.json`);
    }
    /**
     * Search for places that can be attached to a Tweet via POST statuses/update.
     * This request will return a list of all the valid places that can be used as the place_id when updating a status.
     * https://developer.twitter.com/en/docs/twitter-api/v1/geo/places-near-location/api-reference/get-geo-search
     */
    geoSearch(options) {
        return this.get('geo/search.json', options);
    }
    /**
     * Given a latitude and a longitude, searches for up to 20 places that can be used as a place_id when updating a status.
     * This request is an informative call and will deliver generalized results about geography.
     * https://developer.twitter.com/en/docs/twitter-api/v1/geo/places-near-location/api-reference/get-geo-reverse_geocode
     */
    geoReverseGeoCode(options) {
        return this.get('geo/reverse_geocode.json', options);
    }
    /* Developer utilities */
    /**
     * Returns the current rate limits for methods belonging to the specified resource families.
     * Each API resource belongs to a "resource family" which is indicated in its method documentation.
     * The method's resource family can be determined from the first component of the path after the resource version.
     * https://developer.twitter.com/en/docs/twitter-api/v1/developer-utilities/rate-limit-status/api-reference/get-application-rate_limit_status
     */
    rateLimitStatuses(...resources) {
        return this.get('application/rate_limit_status.json', { resources });
    }
    /**
     * Returns the list of languages supported by Twitter along with the language code supported by Twitter.
     * https://developer.twitter.com/en/docs/twitter-api/v1/developer-utilities/supported-languages/api-reference/get-help-languages
     */
    supportedLanguages() {
        return this.get('help/languages.json');
    }
    /**
     * Returns the current configuration used by Twitter including twitter.com slugs which are not usernames, maximum photo resolutions, and t.co shortened URL length.
     * https://developer.twitter.com/en/docs/twitter-api/v1/developer-utilities/configuration/api-reference/get-help-configuration
     */
    twitterConfigurationLimits() {
        return this.get('help/configuration.json');
    }
}
exports.default = TwitterApiv1ReadOnly;
