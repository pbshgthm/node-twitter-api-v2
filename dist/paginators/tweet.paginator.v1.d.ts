import TwitterPaginator from './TwitterPaginator';
import { TwitterResponse, TweetV1, TweetV1TimelineResult, TweetV1TimelineParams, TweetV1UserTimelineParams } from '../types';
/** A generic TwitterPaginator able to consume TweetV1 timelines. */
declare abstract class TweetTimelineV1Paginator<TResult extends TweetV1TimelineResult, TParams extends TweetV1TimelineParams, TShared = any> extends TwitterPaginator<TResult, TParams, TweetV1, TShared> {
    protected refreshInstanceFromResult(response: TwitterResponse<TResult>, isNextPage: true): void;
    protected getNextQueryParams(maxResults?: number): Partial<TParams> & {
        max_results?: number | undefined;
        max_id: string;
    };
    protected getPageLengthFromRequest(result: TwitterResponse<TResult>): number;
    protected isFetchLastOver(result: TwitterResponse<TResult>): boolean;
    protected getItemArray(): TResult;
    /**
     * Tweets returned by paginator.
     */
    get tweets(): TResult;
}
export declare class HomeTimelineV1Paginator extends TweetTimelineV1Paginator<TweetV1TimelineResult, TweetV1TimelineParams> {
    protected _endpoint: string;
}
export declare class MentionTimelineV1Paginator extends TweetTimelineV1Paginator<TweetV1TimelineResult, TweetV1TimelineParams> {
    protected _endpoint: string;
}
export declare class UserTimelineV1Paginator extends TweetTimelineV1Paginator<TweetV1TimelineResult, TweetV1UserTimelineParams> {
    protected _endpoint: string;
}
export {};
