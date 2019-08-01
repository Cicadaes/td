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

import {DatareportTlistComponent} from "../../report-tlist/report-tlist.component";
import {ReporttlistTableComponent} from "../../report-tlist/reporttlist-table.component";
import {ReporttlistFilterComponent} from "../../report-tlist/reporttlist-filter.component";

import {DatatowarrantCommunicationService} from "../../report-service/reporttowarrant.communication.service";
import {ReportToWarrantCommunicationService} from "../../report-service/reporttowarrant.service";

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
        DatareportTlistComponent,
        ReporttlistTableComponent,
        ReporttlistFilterComponent
    ],
    exports:[DatareportTlistComponent],
    providers: [DatatowarrantCommunicationService,ReportToWarrantCommunicationService,DialogCommunicationService]
})
export class DatareportTlistModule {

}
