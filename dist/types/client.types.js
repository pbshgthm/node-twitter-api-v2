"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETwitterStreamEvent = void 0;
var ETwitterStreamEvent;
(function (ETwitterStreamEvent) {
    ETwitterStreamEvent["ConnectionError"] = "connection error";
    ETwitterStreamEvent["ConnectionClosed"] = "connection closed";
    ETwitterStreamEvent["ReconnectError"] = "reconnect error";
    ETwitterStreamEvent["ReconnectLimitExceeded"] = "reconnect limit exceeded";
    ETwitterStreamEvent["DataKeepAlive"] = "data keep-alive";
    ETwitterStreamEvent["Data"] = "data event content";
    ETwitterStreamEvent["TweetParseError"] = "data tweet parse error";
    ETwitterStreamEvent["Error"] = "stream error";
})(ETwitterStreamEvent = exports.ETwitterStreamEvent || (exports.ETwitterStreamEvent = {}));
