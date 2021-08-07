import TwitterApiv2ReadOnly from './client.v2.read';
import type { TweetV2HideReplyResult, TweetV2LikeResult, UserV2BlockResult, UserV2FollowResult, UserV2UnfollowResult } from '../types';
import TwitterApiv2LabsReadWrite from '../v2-labs/client.v2.labs.write';
/**
 * Base Twitter v2 client with read/write rights.
 */
export default class TwitterApiv2ReadWrite extends TwitterApiv2ReadOnly {
    protected _prefix: string;
    protected _labs?: TwitterApiv2LabsReadWrite;
    /**
     * Get a client with only read rights.
     */
    get readOnly(): TwitterApiv2ReadOnly;
    /**
     * Get a client for v2 labs endpoints.
     */
    get labs(): TwitterApiv2LabsReadWrite;
    /**
     * Hides or unhides a reply to a Tweet.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/hide-replies/api-reference/put-tweets-id-hidden
     */
    hideReply(tweetId: string, makeHidden: boolean): Promise<TweetV2HideReplyResult>;
    /**
     * Causes the user ID identified in the path parameter to Like the target Tweet.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/likes/api-reference/post-users-user_id-likes
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    like(loggedUserId: string, targetTweetId: string): Promise<TweetV2LikeResult>;
    /**
     * Allows a user or authenticated user ID to unlike a Tweet.
     * The request succeeds with no action when the user sends a request to a user they're not liking the Tweet or have already unliked the Tweet.
     * https://developer.twitter.com/en/docs/twitter-api/tweets/likes/api-reference/delete-users-user_id-likes
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    unlike(loggedUserId: string, targetTweetId: string): Promise<TweetV2LikeResult>;
    /**
     * Allows a user ID to follow another user.
     * If the target user does not have public Tweets, this endpoint will send a follow request.
     * https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/post-users-source_user_id-following
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    follow(loggedUserId: string, targetUserId: string): Promise<UserV2FollowResult>;
    /**
     * Allows a user ID to unfollow another user.
     * https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/delete-users-source_id-following
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    unfollow(loggedUserId: string, targetUserId: string): Promise<UserV2UnfollowResult>;
    /**
     * Causes the user (in the path) to block the target user.
     * The user (in the path) must match the user context authorizing the request.
     * https://developer.twitter.com/en/docs/twitter-api/users/blocks/api-reference/post-users-user_id-blocking
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    block(loggedUserId: string, targetUserId: string): Promise<UserV2BlockResult>;
    /**
     * Allows a user or authenticated user ID to unblock another user.
     * https://developer.twitter.com/en/docs/twitter-api/users/blocks/api-reference/delete-users-user_id-blocking
     *
     * **Note**: You must specify the currently logged user ID ; you can obtain it through v1.1 API.
     */
    unblock(loggedUserId: string, targetUserId: string): Promise<UserV2BlockResult>;
}
