"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("../globals");
const client_v2_read_1 = __importDefault(require("./client.v2.read"));
const client_v2_labs_write_1 = __importDefault(require("../v2-labs/client.v2.labs.write"));
/**
 * Base Twitter v2 client with read/write rights.
 */
class TwitterApiv2ReadWrite extends client_v2_read_1.default {
    constructor() {
        super(...arguments);
        this._prefix = globals_1.API_V2_PREFIX;
    }
    /* Sub-clients */
    /**
     * Get a client with only read rights.
     */
    get readOnly() {
        return this;
    }
    /**
     * Get a client for v2 labs endpoints.
     */
    get labs() {
        if (this._labs)
            return this._labs;
        return this._labs = new client_v2_labs_write_1.default(this);
    }
    /* Tweets */
    /**
     * Hides or unhides a reply to a Tweet.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/hide-replies/api-reference/put-tweets-id-hidden
     */
    hideReply(tweetId, makeHidden) {
        return this.put(`tweets/${tweetId}/hidden`, { hidden: makeHidden });
    }
    /**
     * Causes the user ID identified in the path parameter to Like the target Tweet.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/likes/api-reference/post-users-user_id-likes
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    like(loggedUserId, targetTweetId) {
        return this.post(`users/${loggedUserId}/likes`, { tweet_id: targetTweetId });
    }
    /**
     * Allows a user or authenticated user ID to unlike a Tweet.
     * The request succeeds with no action when the user sends a request to a user they're not liking the Tweet or have already unliked the Tweet.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/likes/api-reference/delete-users-user_id-likes
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    unlike(loggedUserId, targetTweetId) {
        return this.delete(`users/${loggedUserId}/likes/${targetTweetId}`);
    }
    /* Users */
    /**
     * Allows a user ID to follow another user.
     * If the target user does not have public Tweets, this endpoint will send a follow request.
     * https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/post-users-source_user_id-following
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    follow(loggedUserId, targetUserId) {
        return this.post(`users/${loggedUserId}/following`, { target_user_id: targetUserId });
    }
    /**
     * Allows a user ID to unfollow another user.
     * https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/delete-users-source_id-following
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    unfollow(loggedUserId, targetUserId) {
        return this.delete(`users/${loggedUserId}/following/${targetUserId}`);
    }
    /**
     * Causes the user (in the path) to block the target user.
     * The user (in the path) must match the user context authorizing the request.
     * https://developer.twitter.com/en/docs/twitter-api/users/blocks/api-reference/post-users-user_id-blocking
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    block(loggedUserId, targetUserId) {
        return this.post(`users/${loggedUserId}/blocking`, { target_user_id: targetUserId });
    }
    /**
     * Allows a user or authenticated user ID to unblock another user.
     * https://developer.twitter.com/en/docs/twitter-api/users/blocks/api-reference/delete-users-user_id-blocking
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    unblock(loggedUserId, targetUserId) {
        return this.delete(`users/${loggedUserId}/blocking/${targetUserId}`);
    }
}
exports.default = TwitterApiv2ReadWrite;
