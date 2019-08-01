import { PaginatorxModule } from '../../../common/paginator/paginator.module';
import {DialogDataModule} from '../../../common/dialog/dialog.module';
import {NgModule}       from '@angular/core';
import {CommonModule}   from '@angular/common';
import {FormsModule} from '@angular/forms';
import {GrowlModule}    from 'primeng/primeng';
import {DataTableModule} from "primeng/components/datatable/datatable";
import {DropdownModule} from 'primeng/primeng';
import {CalendarModule}    from 'primeng/primeng';
import {CheckboxModule} from 'primeng/primeng';
import {DialogModule} from 'primeng/primeng';
import {DatePickerModule} from '../../../common/datePicker/datePicker.module';

import {DatareportAlistComponent} from "../../../components/datareport/report-alist/report-alist.component";
import {ReportalistTableComponent} from "../../../components/datareport/report-alist/reportalist-table.component";
import {ReportalistFilterComponent} from "../../../components/datareport/report-alist/reportalist-filter.component";
import {ReportalistDialogComponent} from "../../../components/datareport/report-alist/reportalist-dialog.component";


import {DatapushCommunicationService} from "../../../services/report-service/reportpush.communication.service";
import {ReportPublishingCommunicationService} from "../../../services/report-service/reportpublishing.service";
import {DialogCommunicationService} from "../../../services/dialog/dialog.communication.service";



@NgModule({
    imports: [
        CommonModule,
        DataTableModule,
        DialogDataModule,
        DropdownModule,
        FormsModule,
        CalendarModule,
        CheckboxModule,
        PaginatorxModule,
        GrowlModule,
        DatePickerModule,
        DialogModule
    ],
    declarations: [
        DatareportAlistComponent,
        ReportalistTableComponent,
        ReportalistFilterComponent,
        ReportalistDialogComponent
    ],
    exports:[DatareportAlistComponent],
    providers: [DatapushCommunicationService,ReportPublishingCommunicationService,DialogCommunicationService]
})
export class DatareportAlistModule {

}
