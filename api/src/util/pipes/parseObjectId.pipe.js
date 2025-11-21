"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ParseObjectIdsPipe = exports.ParseObjectIdPipe = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var ParseObjectIdPipe = /** @class */ (function () {
    function ParseObjectIdPipe() {
    }
    ParseObjectIdPipe.prototype.transform = function (value, metadata) {
        if (value) {
            if (mongoose_1.Types.ObjectId.isValid(value)) {
                if (new mongoose_1.Types.ObjectId(value).toString() == value) {
                    return value;
                }
            }
        }
        throw new common_1.HttpException('Invalid Id for the resource', common_1.HttpStatus.BAD_REQUEST);
    };
    ParseObjectIdPipe = __decorate([
        (0, common_1.Injectable)()
    ], ParseObjectIdPipe);
    return ParseObjectIdPipe;
}());
exports.ParseObjectIdPipe = ParseObjectIdPipe;
var ParseObjectIdsPipe = /** @class */ (function () {
    function ParseObjectIdsPipe() {
    }
    ParseObjectIdsPipe.prototype.transform = function (value) {
        if (!value) {
            throw new common_1.HttpException('Invalid Id for the resource', common_1.HttpStatus.BAD_REQUEST);
        }
        if (typeof value == 'string') {
            if (mongoose_1.Types.ObjectId.isValid(value)) {
                if (new mongoose_1.Types.ObjectId(value).toString() == value) {
                    return value;
                }
            }
        }
        var invalidIds = value.filter(function (id) { return !mongoose_1.Types.ObjectId.isValid(id); });
        if (invalidIds.length > 0) {
            throw new common_1.HttpException("Invalid Id for the resource", common_1.HttpStatus.BAD_REQUEST);
        }
        return value;
    };
    return ParseObjectIdsPipe;
}());
exports.ParseObjectIdsPipe = ParseObjectIdsPipe;
