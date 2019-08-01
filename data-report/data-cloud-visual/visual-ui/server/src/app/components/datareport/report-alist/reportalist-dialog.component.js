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
var reportpush_communication_service_1 = require("../report-service/reportpush.communication.service");
var reportpublishing_service_1 = require("../report-service/reportpublishing.service");
var dialog_communication_service_1 = require("../report-service/dialog.communication.service");
var ReportalistDialogComponent = (function () {
    function ReportalistDialogComponent(communication, datacauseCommunicationService, dialogCommunicationService, router) {
        var _this = this;
        this.communication = communication;
        this.datacauseCommunicationService = datacauseCommunicationService;
        this.dialogCommunicationService = dialogCommunicationService;
        this.router = router;
        this.display = false;
        this.dialogWidth = 490;
        this.taskTitle = "新建报表";
        this.showerrTip = false;
        this.datacauseCommunicationService.missionPublishingConfirmed$.subscribe(function (data) {
            _this.display = true;
            _this.showerrTip = false;
        });
    }
    ReportalistDialogComponent.prototype.ngOnInit = function () {
    };
    ReportalistDialogComponent.prototype.changeFromName = function () {
        if (this.dataName == '' || this.dataName == undefined) {
            this.showerrTip = true;
            this.errorTip = "报表名称不能为空";
            return false;
        }
        else {
            this.showerrTip = false;
            this.errorTip = "";
        }
        return true;
    };
    ReportalistDialogComponent.prototype.confirm = function () {
        if (!this.changeFromName()) {
            return;
        }
        console.log(this.dataName);
        this.router.navigateByUrl(this.config.url + "/" + this.dataName + "/1");
    };
    return ReportalistDialogComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ReportalistDialogComponent.prototype, "config", void 0);
ReportalistDialogComponent = __decorate([
    core_1.Component({
        selector: 'reportalist-dialog',
        templateUrl: 'reportalist-dialog.component.html',
        styles: ["\n    "]
    }),
    __metadata("design:paramtypes", [reportpush_communication_service_1.DatapushCommunicationService,
        reportpublishing_service_1.ReportPublishingCommunicationService,
        dialog_communication_service_1.DialogCommunicationService,
        router_1.Router])
], ReportalistDialogComponent);
exports.ReportalistDialogComponent = ReportalistDialogComponent;
//# sourceMappingURL=reportalist-dialog.component.js.map