import TwitterApiSubClient from '../client.subclient';
import { FilterStreamV1Params, SampleStreamV1Params, UserV1, VerifyCredentialsV1Params, AppRateLimitV1Result, TAppRateLimitResourceV1, HelpLanguageV1Result, HelpConfigurationV1Result, ReverseGeoCodeV1Params, ReverseGeoCodeV1Result, PlaceV1, SearchGeoV1Params, SearchGeoV1Result, TrendMatchV1, TrendsPlaceV1Params, TrendLocationV1, TweetV1TimelineParams, TweetV1UserTimelineParams, TweetV1, MediaStatusV1Result } from '../types';
import { HomeTimelineV1Paginator, MentionTimelineV1Paginator, UserTimelineV1Paginator } from '../paginators/tweet.paginator.v1';
/**
 * Base Twitter v1 client with only read right.
 */
export default class TwitterApiv1ReadOnly extends TwitterApiSubClient {
    protected _prefix: string;
    /**
     * Returns a collection of the most recent Tweets and Retweets posted by the authenticating user and the users they follow.
     * The home timeline is central to how most users interact with the Twitter service.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-home_timeline
     */
    homeTimeline(options?: Partial<TweetV1TimelineParams>): Promise<HomeTimelineV1Paginator>;
    /**
     * Returns the 20 most recent mentions (Tweets containing a users's @screen_name) for the authenticating user.
     * The timeline returned is the equivalent of the one seen when you view your mentions on twitter.com.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-mentions_timeline
     */
    mentionTimeline(options?: Partial<TweetV1TimelineParams>): Promise<MentionTimelineV1Paginator>;
    /**
     * Returns a collection of the most recent Tweets posted by the user indicated by the user_id parameters.
     * User timelines belonging to protected users may only be requested when the authenticated user either "owns" the timeline or is an approved follower of the owner.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-user_timeline
     */
    userTimeline(userId: string, options?: Partial<TweetV1UserTimelineParams>): Promise<UserTimelineV1Paginator>;
    /**
     * Returns a collection of the most recent Tweets posted by the user indicated by the screen_name parameters.
     * User timelines belonging to protected users may only be requested when the authenticated user either "owns" the timeline or is an approved follower of the owner.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-user_timeline
     */
    userTimelineByUsername(username: string, options?: Partial<TweetV1UserTimelineParams>): Promise<UserTimelineV1Paginator>;
    /**
     * Returns an HTTP 200 OK response code and a representation of the requesting user if authentication was successful;
     * returns a 401 status code and an error message if not.
     * Use this method to test if supplied user credentials are valid.
     * https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/manage-account-settings/api-reference/get-account-verify_credentials
     */
    verifyCredentials(options?: Partial<VerifyCredentialsV1Params>): Promise<UserV1>;
    /**
     * The STATUS command (this method) is used to periodically poll for updates of media processing operation.
     * After the STATUS command response returns succeeded, you can move on to the next step which is usually create Tweet with media_id.
     * https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/api-reference/get-media-upload-status
     */
    mediaInfo(mediaId: string): Promise<MediaStatusV1Result>;
    /**
     * Returns public statuses that match one or more filter predicates.
     * Multiple parameters may be specified which allows most clients to use a single connection to the Streaming API.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/filter-realtime/api-reference/post-statuses-filter
     */
    filterStream(params?: Partial<FilterStreamV1Params>): Promise<import("..").TweetStream<TweetV1>>;
    /**
     * Returns a small random sample of all public statuses.
     * The Tweets returned by the default access level are the same, so if two different clients connect to this endpoint, they will see the same Tweets.
     * https://developer.twitter.com/en/docs/twitter-api/v1/tweets/sample-realtime/api-reference/get-statuses-sample
     */
    sampleStream(params?: Partial<SampleStreamV1Params>): Promise<import("..").TweetStream<TweetV1>>;
    /**
     * Create a client that is prefixed with `https//stream.twitter.com` instead of classic API URL.
     */
    get stream(): this;
    /**
     * Returns the top 50 trending topics for a specific id, if trending information is available for it.
     * Note: The id parameter for this endpoint is the "where on earth identifier" or WOEID, which is a legacy identifier created by Yahoo and has been deprecated.
     * https://developer.twitter.com/en/docs/twitter-api/v1/trends/trends-for-location/api-reference/get-trends-place
     */
    trendsByPlace(woeId: string | number, options?: Partial<TrendsPlaceV1Params>): Promise<TrendMatchV1[]>;
    /**
     * Returns the locations that Twitter has trending topic information for.
     * The response is an array of "locations" that encode the location's WOEID
     * and some other human-readable information such as a canonical name and country the location belongs in.
     * https://developer.twitter.com/en/docs/twitter-api/v1/trends/locations-with-trending-topics/api-reference/get-trends-available
     */
    trendsAvailable(): Promise<TrendLocationV1[]>;
    /**
     * Returns the locations that Twitter has trending topic information for, closest to a specified location.
     * https://developer.twitter.com/en/docs/twitter-api/v1/trends/locations-with-trending-topics/api-reference/get-trends-closest
     */
    trendsClosest(lat: number, long: number): Promise<TrendLocationV1[]>;
    /**
     * Returns all the information about a known place.
     * https://developer.twitter.com/en/docs/twitter-api/v1/geo/place-information/api-reference/get-geo-id-place_id
     */
    geoPlace(placeId: string): Promise<PlaceV1>;
    /**
     * Search for places that can be attached to a Tweet via POST statuses/update.
     * This request will return a list of all the valid places that can be used as the place_id when updating a status.
     * https://developer.twitter.com/en/docs/twitter-api/v1/geo/places-near-location/api-reference/get-geo-search
     */
    geoSearch(options: Partial<SearchGeoV1Params>): Promise<SearchGeoV1Result>;
    /**
     * Given a latitude and a longitude, searches for up to 20 places that can be used as a place_id when updating a status.
     * This request is an informative call and will deliver generalized results about geography.
     * https://developer.twitter.com/en/docs/twitter-api/v1/geo/places-near-location/api-reference/get-geo-reverse_geocode
     */
    geoReverseGeoCode(options: ReverseGeoCodeV1Params): Promise<ReverseGeoCodeV1Result>;
    /**
     * Returns the current rate limits for methods belonging to the specified resource families.
     * Each API resource belongs to a "resource family" which is indicated in its method documentation.
     * The method's resource family can be determined from the first component of the path after the resource version.
     * https://developer.twitter.com/en/docs/twitter-api/v1/developer-utilities/rate-limit-status/api-reference/get-application-rate_limit_status
     */
    rateLimitStatuses(...resources: TAppRateLimitResourceV1[]): Promise<AppRateLimitV1Result>;
    /**
     * Returns the list of languages supported by Twitter along with the language code supported by Twitter.
     * https://developer.twitter.com/en/docs/twitter-api/v1/developer-utilities/supported-languages/api-reference/get-help-languages
     */
    supportedLanguages(): Promise<HelpLanguageV1Result[]>;
    /**
     * Returns the current configuration used by Twitter including twitter.com slugs which are not usernames, maximum photo resolutions, and t.co shortened URL length.
     * https://developer.twitter.com/en/docs/twitter-api/v1/developer-utilities/configuration/api-reference/get-help-configuration
     */
    twitterConfigurationLimits(): Promise<HelpConfigurationV1Result>;
}
