"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var paginator_module_1 = require("../../common/paginator/paginator.module");
var dialog_module_1 = require("../../common/dialog/dialog.module");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var primeng_1 = require("primeng/primeng");
var datatable_1 = require("primeng/components/datatable/datatable");
var primeng_2 = require("primeng/primeng");
var primeng_3 = require("primeng/primeng");
var primeng_4 = require("primeng/primeng");
var primeng_5 = require("primeng/primeng");
var primeng_6 = require("primeng/primeng");
var primeng_7 = require("primeng/primeng");
var datePicker_module_1 = require("../../common/datePicker/datePicker.module");
var report_alist_component_1 = require("../../report-alist/report-alist.component");
var reportalist_table_component_1 = require("../../report-alist/reportalist-table.component");
var reportalist_filter_component_1 = require("../../report-alist/reportalist-filter.component");
var reportalist_dialog_component_1 = require("../../report-alist/reportalist-dialog.component");
var reportpush_communication_service_1 = require("../../report-service/reportpush.communication.service");
var reportpublishing_service_1 = require("../../report-service/reportpublishing.service");
var dialog_communication_service_1 = require("../../report-service/dialog.communication.service");
var DatareportAlistModule = (function () {
    function DatareportAlistModule() {
    }
    return DatareportAlistModule;
}());
DatareportAlistModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            datatable_1.DataTableModule,
            dialog_module_1.DialogDataModule,
            primeng_2.DropdownModule,
            forms_1.FormsModule,
            primeng_3.CalendarModule,
            primeng_4.CheckboxModule,
            paginator_module_1.PaginatorxModule,
            primeng_1.GrowlModule,
            primeng_5.AutoCompleteModule,
            primeng_6.RadioButtonModule,
            datePicker_module_1.DatePickerModule,
            primeng_7.DialogModule
        ],
        declarations: [
            report_alist_component_1.DatareportAlistComponent,
            reportalist_table_component_1.ReportalistTableComponent,
            reportalist_filter_component_1.ReportalistFilterComponent,
            reportalist_dialog_component_1.ReportalistDialogComponent
        ],
        exports: [report_alist_component_1.DatareportAlistComponent],
        providers: [reportpush_communication_service_1.DatapushCommunicationService, reportpublishing_service_1.ReportPublishingCommunicationService, dialog_communication_service_1.DialogCommunicationService]
    })
], DatareportAlistModule);
exports.DatareportAlistModule = DatareportAlistModule;
//# sourceMappingURL=alist.module.js.map