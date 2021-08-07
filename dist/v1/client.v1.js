"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterApiv1 = void 0;
const globals_1 = require("../globals");
const client_v1_write_1 = __importDefault(require("./client.v1.write"));
/**
 * Twitter v1.1 API client with read/write/DMs rights.
 */
class TwitterApiv1 extends client_v1_write_1.default {
    constructor() {
        super(...arguments);
        this._prefix = globals_1.API_V1_1_PREFIX;
    }
    /**
     * Get a client with read/write rights.
     */
    get readWrite() {
        return this;
    }
}
exports.TwitterApiv1 = TwitterApiv1;
exports.default = TwitterApiv1;
