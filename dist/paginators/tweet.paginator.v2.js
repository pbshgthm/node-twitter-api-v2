"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetUserMentionTimelineV2Paginator = exports.TweetUserTimelineV2Paginator = exports.TweetSearchAllV2Paginator = exports.TweetSearchRecentV2Paginator = void 0;
const TwitterPaginator_1 = require("./TwitterPaginator");
/** A generic PreviousableTwitterPaginator able to consume TweetV2 timelines. */
class TweetTimelineV2Paginator extends TwitterPaginator_1.PreviousableTwitterPaginator {
    refreshInstanceFromResult(response, isNextPage) {
        const result = response.data;
        this._rateLimit = response.rateLimit;
        if (isNextPage) {
            this._realData.meta.oldest_id = result.meta.oldest_id;
            this._realData.meta.result_count += result.meta.result_count;
            this._realData.meta.next_token = result.meta.next_token;
            this._realData.data.push(...result.data);
        }
        else {
            this._realData.meta.newest_id = result.meta.newest_id;
            this._realData.meta.result_count += result.meta.result_count;
            this._realData.data.unshift(...result.data);
        }
    }
    getNextQueryParams(maxResults) {
        return {
            ...this._queryParams,
            until_id: this._realData.meta.oldest_id,
            ...(maxResults ? { max_results: maxResults } : {})
        };
    }
    getPreviousQueryParams(maxResults) {
        return {
            ...this._queryParams,
            since_id: this._realData.meta.newest_id,
            ...(maxResults ? { max_results: maxResults } : {})
        };
    }
    getPageLengthFromRequest(result) {
        return result.data.data.length;
    }
    isFetchLastOver(result) {
        return !result.data.data.length || !result.data.meta.next_token;
    }
    getItemArray() {
        return this.tweets;
    }
    /**
     * Tweets returned by paginator.
     */
    get tweets() {
        return this._realData.data;
    }
}
// ----------------
// - Tweet search -
// ----------------
class TweetSearchRecentV2Paginator extends TweetTimelineV2Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'tweets/search/recent';
    }
}
exports.TweetSearchRecentV2Paginator = TweetSearchRecentV2Paginator;
class TweetSearchAllV2Paginator extends TweetTimelineV2Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'tweets/search/all';
    }
}
exports.TweetSearchAllV2Paginator = TweetSearchAllV2Paginator;
class TweetUserTimelineV2Paginator extends TweetTimelineV2Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'users/:id/tweets';
    }
    getEndpoint() {
        return this._endpoint.replace(':id', this._sharedParams.userId);
    }
}
exports.TweetUserTimelineV2Paginator = TweetUserTimelineV2Paginator;
class TweetUserMentionTimelineV2Paginator extends TweetTimelineV2Paginator {
    constructor() {
        super(...arguments);
        this._endpoint = 'users/:id/mentions';
    }
    getEndpoint() {
        return this._endpoint.replace(':id', this._sharedParams.userId);
    }
}
exports.TweetUserMentionTimelineV2Paginator = TweetUserMentionTimelineV2Paginator;
