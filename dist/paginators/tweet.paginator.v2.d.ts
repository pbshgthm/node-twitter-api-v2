import { PreviousableTwitterPaginator } from './TwitterPaginator';
import { Tweetv2SearchParams, Tweetv2SearchResult, TwitterResponse, TweetV2, Tweetv2TimelineResult, TweetV2TimelineParams, TweetV2UserTimelineResult, TweetV2UserTimelineParams } from '../types';
/** A generic PreviousableTwitterPaginator able to consume TweetV2 timelines. */
declare abstract class TweetTimelineV2Paginator<TResult extends Tweetv2TimelineResult, TParams extends TweetV2TimelineParams, TShared = any> extends PreviousableTwitterPaginator<TResult, TParams, TweetV2, TShared> {
    protected refreshInstanceFromResult(response: TwitterResponse<TResult>, isNextPage: boolean): void;
    protected getNextQueryParams(maxResults?: number): Partial<TParams> & {
        max_results?: number | undefined;
        until_id: string;
    };
    protected getPreviousQueryParams(maxResults?: number): Partial<TParams> & {
        max_results?: number | undefined;
        since_id: string;
    };
    protected getPageLengthFromRequest(result: TwitterResponse<TResult>): number;
    protected isFetchLastOver(result: TwitterResponse<TResult>): boolean;
    protected getItemArray(): TweetV2[];
    /**
     * Tweets returned by paginator.
     */
    get tweets(): TweetV2[];
}
export declare class TweetSearchRecentV2Paginator extends TweetTimelineV2Paginator<Tweetv2SearchResult, Tweetv2SearchParams> {
    protected _endpoint: string;
}
export declare class TweetSearchAllV2Paginator extends TweetTimelineV2Paginator<Tweetv2SearchResult, Tweetv2SearchParams> {
    protected _endpoint: string;
}
declare type TUserTimelinePaginatorShared = {
    userId: string;
};
export declare class TweetUserTimelineV2Paginator extends TweetTimelineV2Paginator<TweetV2UserTimelineResult, TweetV2UserTimelineParams, TUserTimelinePaginatorShared> {
    protected _endpoint: string;
    protected getEndpoint(): string;
}
export declare class TweetUserMentionTimelineV2Paginator extends TweetTimelineV2Paginator<TweetV2UserTimelineResult, TweetV2UserTimelineParams, TUserTimelinePaginatorShared> {
    protected _endpoint: string;
    protected getEndpoint(): string;
}
export {};
