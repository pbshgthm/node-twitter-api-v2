import TwitterApiv1ReadOnly from './client.v1.read';
import { MediaStatusV1Result, MediaMetadataV1Params, MediaSubtitleV1Param, SendTweetV1Params, TUploadableMedia, TweetV1, UploadMediaV1Params } from '../types';
import { TFileHandle } from './media-helpers.v1';
/**
 * Base Twitter v1 client with read/write rights.
 */
export default class TwitterApiv1ReadWrite extends TwitterApiv1ReadOnly {
    protected _prefix: string;
    /**
     * Get a client with only read rights.
     */
    get readOnly(): TwitterApiv1ReadOnly;
    /**
     * Post a new tweet.
     */
    tweet(status: string, payload?: Partial<SendTweetV1Params>): Promise<TweetV1>;
    /**
     * Reply to an existing tweet.
     */
    reply(status: string, in_reply_to_status_id: string, payload?: Partial<SendTweetV1Params>): Promise<TweetV1>;
    /**
     * This endpoint can be used to provide additional information about the uploaded media_id.
     * This feature is currently only supported for images and GIFs.
     * https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/api-reference/post-media-metadata-create
     */
    createMediaMetadata(mediaId: string, metadata: Partial<MediaMetadataV1Params>): Promise<void>;
    /**
     * Use this endpoint to associate uploaded subtitles to an uploaded video. You can associate subtitles to video before or after Tweeting.
     * **To obtain subtitle media ID, you must upload each subtitle file separately using `.uploadMedia()` method.**
     *
     * https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/api-reference/post-media-subtitles-create
     */
    createMediaSubtitles(mediaId: string, subtitles: MediaSubtitleV1Param[]): Promise<void>;
    /**
     * Use this endpoint to dissociate subtitles from a video and delete the subtitles. You can dissociate subtitles from a video before or after Tweeting.
     * https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/api-reference/post-media-subtitles-delete
     */
    deleteMediaSubtitles(mediaId: string, ...languages: string[]): Promise<void>;
    /**
     * Upload a media (JPG/PNG/GIF/MP4/WEBP) or subtitle (SRT) to Twitter and return the media_id to use in tweet/DM send.
     *
     * @param file If `string`, filename is supposed.
     * A `Buffer` is a raw file.
     * `fs.promises.FileHandle` or `number` are file pointers.
     *
     * @param options.type File type (Enum 'jpg' | 'longmp4' | 'mp4' | 'png' | 'gif' | 'srt' | 'webp').
     * If filename is given, it could be guessed with file extension, otherwise this parameter is mandatory.
     * If type is not part of the enum, it will be used as mime type.
     *
     * Type `longmp4` is **required** is you try to upload a video higher than 140 seconds.
     *
     * @param options.chunkLength Maximum chunk length sent to Twitter. Default goes to 1 MB.
     *
     * @param options.additionalOwners Other user IDs allowed to use the returned media_id. Default goes to none.
     *
     * @param options.maxConcurrentUploads Maximum uploaded chunks in the same time. Default goes to 3.
     *
     * @param options.target Target type `tweet` or `dm`. Defaults to `tweet`.
     * You must specify it if you send a media to use in DMs.
     */
    uploadMedia(file: TUploadableMedia, options?: Partial<UploadMediaV1Params>): Promise<string>;
    protected awaitForMediaProcessingCompletion(fullMediaData: MediaStatusV1Result): Promise<void>;
    protected getUploadMediaRequirements(file: TUploadableMedia, { type, target }?: Partial<UploadMediaV1Params>): Promise<{
        fileHandle: TFileHandle;
        mediaCategory: string;
        fileSize: number;
        mimeType: string;
    }>;
    protected mediaChunkedUpload(fileHandle: TFileHandle, chunkLength: number, mediaId: string, maxConcurrentUploads?: number): Promise<void>;
}
