"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("../globals");
const client_v1_read_1 = __importDefault(require("./client.v1.read"));
const fs_1 = __importDefault(require("fs"));
const media_helpers_v1_1 = require("./media-helpers.v1");
const UPLOAD_ENDPOINT = 'media/upload.json';
/**
 * Base Twitter v1 client with read/write rights.
 */
class TwitterApiv1ReadWrite extends client_v1_read_1.default {
    constructor() {
        super(...arguments);
        this._prefix = globals_1.API_V1_1_PREFIX;
    }
    /**
     * Get a client with only read rights.
     */
    get readOnly() {
        return this;
    }
    /* Tweet API */
    /**
     * Post a new tweet.
     */
    tweet(status, payload = {}) {
        const queryParams = {
            status,
            tweet_mode: 'extended',
            ...payload
        };
        return this.post('statuses/update.json', queryParams);
    }
    /**
     * Reply to an existing tweet.
     */
    reply(status, in_reply_to_status_id, payload = {}) {
        return this.tweet(status, {
            auto_populate_reply_metadata: true,
            in_reply_to_status_id,
            ...payload,
        });
    }
    /* Media upload API */
    /**
     * This endpoint can be used to provide additional information about the uploaded media_id.
     * This feature is currently only supported for images and GIFs.
     * https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/api-reference/post-media-metadata-create
     */
    createMediaMetadata(mediaId, metadata) {
        return this.post('media/metadata/create.json', { media_id: mediaId, ...metadata }, { prefix: globals_1.API_V1_1_UPLOAD_PREFIX, forceBodyMode: 'json' });
    }
    /**
     * Use this endpoint to associate uploaded subtitles to an uploaded video. You can associate subtitles to video before or after Tweeting.
     * **To obtain subtitle media ID, you must upload each subtitle file separately using `.uploadMedia()` method.**
     *
     * https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/api-reference/post-media-subtitles-create
     */
    createMediaSubtitles(mediaId, subtitles) {
        return this.post('media/subtitles/create.json', { media_id: mediaId, media_category: 'TweetVideo', subtitle_info: { subtitles } }, { prefix: globals_1.API_V1_1_UPLOAD_PREFIX, forceBodyMode: 'json' });
    }
    /**
     * Use this endpoint to dissociate subtitles from a video and delete the subtitles. You can dissociate subtitles from a video before or after Tweeting.
     * https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/api-reference/post-media-subtitles-delete
     */
    deleteMediaSubtitles(mediaId, ...languages) {
        return this.post('media/subtitles/delete.json', {
            media_id: mediaId,
            media_category: 'TweetVideo',
            subtitle_info: { subtitles: languages.map(lang => ({ language_code: lang })) },
        }, { prefix: globals_1.API_V1_1_UPLOAD_PREFIX, forceBodyMode: 'json' });
    }
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
    async uploadMedia(file, options = {}) {
        var _a;
        const chunkLength = (_a = options.chunkLength) !== null && _a !== void 0 ? _a : (1024 * 1024);
        const { fileHandle, mediaCategory, fileSize, mimeType } = await this.getUploadMediaRequirements(file, options);
        // Get the file handle (if not buffer)
        try {
            // Finally! We can send INIT message.
            const mediaData = await this.post(UPLOAD_ENDPOINT, {
                command: 'INIT',
                total_bytes: fileSize,
                media_type: mimeType,
                media_category: mediaCategory,
                additional_owners: options.additionalOwners,
            }, { prefix: globals_1.API_V1_1_UPLOAD_PREFIX });
            // Upload the media chunk by chunk
            await this.mediaChunkedUpload(fileHandle, chunkLength, mediaData.media_id_string, options.maxConcurrentUploads);
            // Finalize media
            let fullMediaData = await this.post(UPLOAD_ENDPOINT, {
                command: 'FINALIZE',
                media_id: mediaData.media_id_string,
            }, { prefix: globals_1.API_V1_1_UPLOAD_PREFIX });
            if (fullMediaData.processing_info && fullMediaData.processing_info.state !== 'succeeded') {
                // Must wait if video is still computed
                await this.awaitForMediaProcessingCompletion(fullMediaData);
            }
            // Video is ready, return media_id
            return fullMediaData.media_id_string;
        }
        finally {
            // Close file if any
            if (typeof file === 'number') {
                fs_1.default.close(file, () => { });
            }
            else if (typeof fileHandle === 'object' && !(fileHandle instanceof Buffer)) {
                fileHandle.close();
            }
        }
    }
    async awaitForMediaProcessingCompletion(fullMediaData) {
        while (true) {
            fullMediaData = await this.mediaInfo(fullMediaData.media_id_string);
            if (!fullMediaData.processing_info || fullMediaData.processing_info.state === 'succeeded') {
                // Ok, completed!
                return;
            }
            if (fullMediaData.processing_info.state === 'failed') {
                throw new Error('Failed to process the media.');
            }
            if (fullMediaData.processing_info.check_after_secs) {
                // Await for given seconds
                await media_helpers_v1_1.sleepSecs(fullMediaData.processing_info.check_after_secs);
            }
            else {
                // No info; Await for 5 seconds
                await media_helpers_v1_1.sleepSecs(5);
            }
        }
    }
    async getUploadMediaRequirements(file, { type, target } = {}) {
        // Get the file handle (if not buffer)
        let fileHandle;
        try {
            fileHandle = await media_helpers_v1_1.getFileHandle(file);
            // Get the mimetype
            const mimeType = media_helpers_v1_1.getMimeType(file, type);
            // Get the media category
            let mediaCategory;
            if (type === 'longmp4') {
                mediaCategory = 'amplify_video';
            }
            else {
                mediaCategory = media_helpers_v1_1.getMediaCategoryByMime(mimeType, target !== null && target !== void 0 ? target : 'tweet');
            }
            return {
                fileHandle,
                mediaCategory,
                fileSize: await media_helpers_v1_1.getFileSizeFromFileHandle(fileHandle),
                mimeType,
            };
        }
        catch (e) {
            // Close file if any
            if (typeof file === 'number') {
                fs_1.default.close(file, () => { });
            }
            else if (typeof fileHandle === 'object' && !(fileHandle instanceof Buffer)) {
                fileHandle.close();
            }
            throw e;
        }
    }
    async mediaChunkedUpload(fileHandle, chunkLength, mediaId, maxConcurrentUploads = 3) {
        // Send chunk by chunk
        let chunkIndex = 0;
        if (maxConcurrentUploads < 1) {
            throw new RangeError('Bad maxConcurrentUploads parameter.');
        }
        // Creating a buffer for doing file stuff (if we don't have one)
        const buffer = fileHandle instanceof Buffer ? undefined : Buffer.alloc(chunkLength);
        // Sliced/filled buffer returned for each part
        let readBuffer;
        // Needed to know when we should stop reading the file
        let nread;
        // Needed to use the buffer object (file handles always "remembers" file position)
        let offset = 0;
        [readBuffer, nread] = await media_helpers_v1_1.readNextPartOf(fileHandle, chunkLength, offset, buffer);
        offset += nread;
        // Handle max concurrent uploads
        const currentUploads = new Set();
        // Read buffer until file is completely read
        while (nread) {
            const mediaBufferPart = readBuffer.slice(0, nread);
            // Sent part if part has something inside
            if (mediaBufferPart.length) {
                const request = this.post(UPLOAD_ENDPOINT, {
                    command: 'APPEND',
                    media_id: mediaId,
                    segment_index: chunkIndex,
                    media: mediaBufferPart,
                }, { prefix: globals_1.API_V1_1_UPLOAD_PREFIX });
                currentUploads.add(request);
                request.then(() => {
                    currentUploads.delete(request);
                });
                chunkIndex++;
            }
            if (currentUploads.size >= maxConcurrentUploads) {
                // Await for first promise to be finished
                await Promise.race([...currentUploads]);
            }
            [readBuffer, nread] = await media_helpers_v1_1.readNextPartOf(fileHandle, chunkLength, offset, buffer);
            offset += nread;
        }
        await Promise.all([...currentUploads]);
    }
}
exports.default = TwitterApiv1ReadWrite;
