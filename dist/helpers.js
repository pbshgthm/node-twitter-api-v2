"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimUndefinedProperties = exports.arrayWrap = void 0;
function arrayWrap(value) {
    if (Array.isArray(value)) {
        return value;
    }
    return [value];
}
exports.arrayWrap = arrayWrap;
function trimUndefinedProperties(object) {
    // Delete undefined parameters
    for (const parameter in object) {
        if (object[parameter] === undefined)
            delete object[parameter];
    }
}
exports.trimUndefinedProperties = trimUndefinedProperties;
