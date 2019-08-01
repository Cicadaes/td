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
var dataOurTime = require("../report-js/util");
var dialog_communication_service_1 = require("../report-service/dialog.communication.service");
var reporttowarrant_communication_service_1 = require("../report-service/reporttowarrant.communication.service");
var reporttowarrant_service_1 = require("../report-service/reporttowarrant.service");
var ReporttlistTableComponent = (function () {
    function ReporttlistTableComponent(communication, datacauseCommunicationService, dialogCommunicationService, router) {
        this.communication = communication;
        this.datacauseCommunicationService = datacauseCommunicationService;
        this.dialogCommunicationService = dialogCommunicationService;
        this.router = router;
        this.dispatDatas = [];
        this.queryObj = {};
        this.currentPage = 1;
        this.currentRows = 10;
        this.value = {
            totalRecords: 0,
            rows: this.currentRows,
            pageLinkSize: 10,
            rowsPerPageOptions: [10, 20, 50, 100] //条数切换
        };
        this.communication.jsonPath = this.jsonpath;
        this.datacauseCommunicationService.missionUpdateListConfirmed$.subscribe(function () {
        });
    }
    ReporttlistTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.datacauseCommunicationService.setQueryObjSource$.subscribe(function (queryObj) { return _this.queryObj = queryObj; });
        this.datacauseCommunicationService.changePageSource$.subscribe(function (newPage) { return _this.page(newPage); });
        this.datacauseCommunicationService.missionUpdateListConfirmed$.subscribe(function () { return _this.page(1); });
        this.page(1);
    };
    ReporttlistTableComponent.prototype.page = function (newPage) {
        // if (this.currentPage != 1 && newPage == 1) {
        if (newPage == 1) {
            this.dispatDatas = null;
        }
        this.currentPage = newPage;
        this.refreshData();
    };
    ReporttlistTableComponent.prototype.refreshData = function () {
        var _this = this;
        this.queryObj.page = this.currentPage;
        this.queryObj.pageSize = this.currentRows;
        this.communication.query(this.queryObj).then(function (res) {
            for (var i = 0; i < res.data.length; i++) {
                res.data[i].createTime = dataOurTime.date(res.data[i].createTime, null);
                res.data[i].updateTime = dataOurTime.date(res.data[i].updateTime, null);
            }
            _this.dispatDatas = res.data;
            _this.dispatTotal = res.total;
            _this.value.totalRecords = res.total;
            console.log(res);
        }).catch(function (err) { console.log(err); });
    };
    //翻页
    ReporttlistTableComponent.prototype.paginate = function (params) {
        console.log(params);
        this.currentRows = params.rows;
        this.currentPage = params.page + 1;
        // this.page(this.currentPage);
        this.refreshData();
    };
    //授权
    ReporttlistTableComponent.prototype.toWarrantProject = function (data) {
        data = { obj: data, type: "editor" };
        this.datacauseCommunicationService.layerConfirmMission(data);
    };
    //进入详情
    ReporttlistTableComponent.prototype.detailTaskProject = function (project) {
        console.log(project.id, "project");
        this.router.navigateByUrl(this.config.detailUrl + "/" + project.id + "/" + 0);
    };
    return ReporttlistTableComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ReporttlistTableComponent.prototype, "config", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ReporttlistTableComponent.prototype, "jsonpath", void 0);
ReporttlistTableComponent = __decorate([
    core_1.Component({
        selector: 'reporttlist-table',
        templateUrl: 'reporttlist-table.component.html'
    }),
    __metadata("design:paramtypes", [reporttowarrant_communication_service_1.DatatowarrantCommunicationService,
        reporttowarrant_service_1.ReportToWarrantCommunicationService,
        dialog_communication_service_1.DialogCommunicationService,
        router_1.Router])
], ReporttlistTableComponent);
exports.ReporttlistTableComponent = ReporttlistTableComponent;
//# sourceMappingURL=reporttlist-table.component.js.map