"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var reportpublishing_service_1 = require("../report-service/reportpublishing.service");
var DatareportAlistComponent = (function () {
    function DatareportAlistComponent(datacauseCommunicationService, router) {
        this.datacauseCommunicationService = datacauseCommunicationService;
        this.router = router;
    }
    DatareportAlistComponent.prototype.ngOnInit = function () { };
    DatareportAlistComponent.prototype.search = function () {
        var queryObj = {};
        if (this.searchText) {
            queryObj['name'] = "%" + this.searchText.replace(/([%\\_])/g, "\\$1") + "%",
                queryObj['nameOperator'] = "like";
        }
        this.datacauseCommunicationService.setQueryObj(queryObj);
        this.datacauseCommunicationService.changePage(1);
    };
    return DatareportAlistComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], DatareportAlistComponent.prototype, "config", void 0);
DatareportAlistComponent = __decorate([
    core_1.Component({
        selector: 'report-alist',
        templateUrl: 'report-alist.component.html'
    }),
    __metadata("design:paramtypes", [reportpublishing_service_1.ReportPublishingCommunicationService,
        router_1.Router])
], DatareportAlistComponent);
exports.DatareportAlistComponent = DatareportAlistComponent;
//# sourceMappingURL=report-alist.component.js.map