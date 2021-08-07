/// <reference types="node" />
import fs from 'fs';
import type { TUploadableMedia, TUploadTypeV1 } from '../types';
export declare type TFileHandle = fs.promises.FileHandle | number | Buffer;
export declare function getFileHandle(file: TUploadableMedia): number | Buffer | fs.promises.FileHandle | Promise<fs.promises.FileHandle>;
export declare function getFileSizeFromFileHandle(fileHandle: TFileHandle): Promise<number>;
export declare function getMimeType(file: TUploadableMedia, type?: TUploadTypeV1): "image/jpeg" | "image/png" | "image/webp" | "image/gif" | "video/mp4" | "text/plain";
export declare function getMediaCategoryByMime(name: string, target: 'tweet' | 'dm'): "TweetVideo" | "DmVideo" | "TweetGif" | "DmGif" | "Subtitles" | "TweetImage" | "DmImage";
export declare function sleepSecs(seconds: number): Promise<unknown>;
export declare function readNextPartOf(file: TFileHandle, chunkLength: number, bufferOffset?: number, buffer?: Buffer): Promise<[Buffer, number]>;
