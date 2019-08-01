import { PaginatorxModule } from '../../common/paginator/paginator.module';
import {DialogDataModule} from '../../common/dialog/dialog.module';
import {NgModule}       from '@angular/core';
import {CommonModule}   from '@angular/common';
import {FormsModule} from '@angular/forms';
import {GrowlModule}    from 'primeng/primeng';
import {DataTableModule} from "primeng/components/datatable/datatable";
import {DropdownModule} from 'primeng/primeng';
import {CalendarModule}    from 'primeng/primeng';
import {CheckboxModule} from 'primeng/primeng';
import {AutoCompleteModule} from 'primeng/primeng';
import {RadioButtonModule} from 'primeng/primeng';
import {DialogModule} from 'primeng/primeng';
import {DatePickerModule} from '../../common/datePicker/datePicker.module';

import {DatareportAlistComponent} from "../../report-alist/report-alist.component";
import {ReportalistTableComponent} from "../../report-alist/reportalist-table.component";
import {ReportalistFilterComponent} from "../../report-alist/reportalist-filter.component";
import {ReportalistDialogComponent} from "../../report-alist/reportalist-dialog.component";


import {DatapushCommunicationService} from "../../report-service/reportpush.communication.service";
import {ReportPublishingCommunicationService} from "../../report-service/reportpublishing.service";
import {DialogCommunicationService} from "../../report-service/dialog.communication.service";



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
        AutoCompleteModule,
        RadioButtonModule,
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
