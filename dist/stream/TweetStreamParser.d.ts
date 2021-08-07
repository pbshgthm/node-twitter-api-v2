/// <reference types="node" />
import { EventEmitter } from 'events';
export default class TweetStreamParser extends EventEmitter {
    protected currentMessage: string;
    push(chunk: string): void;
}
export declare enum EStreamParserEvent {
    ParsedData = "parsed data",
    ParseError = "parse error"
}
