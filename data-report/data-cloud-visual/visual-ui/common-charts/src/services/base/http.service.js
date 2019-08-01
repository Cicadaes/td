"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by wangshouyun on 2017/3/8.
 */
var http_abstract_1 = require("./http.abstract");
var http_header_1 = require("./http.header");
var HttpService = (function (_super) {
    __extends(HttpService, _super);
    function HttpService() {
        var _this = _super.apply(this, arguments) || this;
        _this.header = new http_header_1.HttpHeader({ 'Content-Type': 'application/json' });
        return _this;
    }
    HttpService.prototype.get = function (url, params, header) {
        var _this = this;
        var xmlHttp = this.getXmlHttp();
        var queryParams = "";
        if (params) {
            queryParams = "?" + this.getParams(params);
        }
        if (header) {
            for (var key in header) {
                xmlHttp.setRequestHeader(key, header[key]);
            }
        }
        var promise = new Promise(function (resolve, reject) {
            xmlHttp.open("GET", url + queryParams, true);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    resolve(xmlHttp.responseText);
                }
                else if (xmlHttp.status != 200) {
                    reject(xmlHttp.status);
                }
            };
            xmlHttp.send();
        });
        promise.catch(function (error) {
            _this.errorHandler(error);
        });
        return promise;
    };
    HttpService.prototype.post = function (url, body, header) {
        var _this = this;
        var xmlHttp = this.getXmlHttp();
        var bodyData = null;
        if (body) {
            bodyData = JSON.stringify(body);
        }
        if (header) {
            for (var key in header) {
                xmlHttp.setRequestHeader(key, header[key]);
            }
        }
        var promise = new Promise(function (resolve, reject) {
            xmlHttp.open("POST", url, true);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    resolve(xmlHttp.responseText);
                }
                else if (xmlHttp.status != 200) {
                    reject(xmlHttp.status);
                }
            };
            xmlHttp.send(bodyData);
        });
        promise.catch(function (error) {
            _this.errorHandler(error);
        });
        return promise;
    };
    HttpService.prototype.put = function (url, body, header) {
        var _this = this;
        var xmlHttp = this.getXmlHttp();
        var bodyData = null;
        if (body) {
            bodyData = JSON.stringify(body);
        }
        if (header) {
            for (var key in header) {
                xmlHttp.setRequestHeader(key, header[key]);
            }
        }
        var promise = new Promise(function (resolve, reject) {
            xmlHttp.open("PUT", url, true);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    resolve(xmlHttp.responseText);
                }
                else if (xmlHttp.status != 200) {
                    reject(xmlHttp.status);
                }
            };
            xmlHttp.send(bodyData);
        });
        promise.catch(function (error) {
            _this.errorHandler(error);
        });
        return promise;
    };
    HttpService.prototype.delete = function (url, id, header) {
        var _this = this;
        var xmlHttp = this.getXmlHttp();
        if (header) {
            for (var key in header) {
                xmlHttp.setRequestHeader(key, header[key]);
            }
        }
        var promise = new Promise(function (resolve, reject) {
            xmlHttp.open("PUT", url + "/" + id, true);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    resolve(xmlHttp.responseText);
                }
                else if (xmlHttp.status != 200) {
                    reject(xmlHttp.status);
                }
            };
            xmlHttp.send();
        });
        promise.catch(function (error) {
            _this.errorHandler(error);
        });
        return promise;
    };
    HttpService.prototype.errorHandler = function (error) {
        return Promise.reject(error.message || error);
    };
    return HttpService;
}(http_abstract_1.AHttp));
exports.HttpService = HttpService;
//# sourceMappingURL=http.service.js.map