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

import {DatareportMlistComponent} from "../../report-mlist/report-mlist.component";
import {ReportmlistTableComponent} from "../../report-mlist/reportmlist-table.component";
import {ReportmlistFilterComponent} from "../../report-mlist/reportmlist-filter.component";
import {ReportmlistDialogComponent} from "../../report-mlist/reportmlist-dialog.component";

import {DatareportCommunicationService} from "../../report-service/datareport.communication.service";
import {DatareportcauseCommunicationService} from "../../report-service/datareportcause.service";
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
        DatareportMlistComponent,
        ReportmlistTableComponent,
        ReportmlistFilterComponent,
        ReportmlistDialogComponent
    ],
    exports:[DatareportMlistComponent],
    providers: [DatareportCommunicationService,DatareportcauseCommunicationService,DialogCommunicationService]
})
export class DatareportMlistModule {

}
