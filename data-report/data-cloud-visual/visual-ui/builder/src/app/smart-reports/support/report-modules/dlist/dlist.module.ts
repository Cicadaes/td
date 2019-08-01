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
import {TabViewModule,TreeModule} from 'primeng/primeng';
import {DialogModule} from 'primeng/primeng';
import {DatePickerModule} from '../../common/datePicker/datePicker.module';

import {DatareportDlistComponent} from "../../report-dlist/report-dlist.component";
import {ReportdlistTableComponent} from "../../report-dlist/reportdlist-table.component";
import {ReportdlistFilterComponent} from "../../report-dlist/reportdlist-filter.component";
import {ReportdlistDialogComponent} from "../../report-dlist/reportdlist-dialog.component";

import {ReportDialogLayerComponent} from "../../report-dlist/report-dialog/report-dialog-layer.component";
import {ReportDialogSqlComponent} from "../../report-dlist/report-dialog/report-dialog-sql.component";

import {DatareportDetialComponent} from '../../report-dlist/report-detail/report-detail.component';
import {ReportddetailDialogComponent} from '../../report-dlist/report-detail/reportddetail-dialog.component';
import {AssociatedReportTableComponent} from '../../report-dlist/report-detail/associated-report-table/associated-report-table.component';
import {SampleReportTableComponent} from '../../report-dlist/report-detail/sample-report-table/sample-report-table.component';
import {MetadataReportTableComponent} from '../../report-dlist/report-detail/metadata-report-table/metadata-report-table.component';

import {ReportBrowserComponent} from "../../report-dlist/report-dialog/report-browser.component"

import {DatasourceCommunicationService} from "../../report-service/datasource.communication.service";
import {DatacauseCommunicationService} from "../../report-service/datacause.service";
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
        TabViewModule,
        DialogModule,
        TreeModule
    ],
    declarations: [
        DatareportDlistComponent,
        ReportdlistTableComponent,
        ReportdlistFilterComponent,
        ReportdlistDialogComponent,
        DatareportDetialComponent,
        AssociatedReportTableComponent,
        SampleReportTableComponent,
        MetadataReportTableComponent,
        ReportddetailDialogComponent,
        ReportDialogLayerComponent,
        ReportDialogSqlComponent,
        ReportBrowserComponent
    ],
    exports:[DatareportDlistComponent,DatareportDetialComponent],
    providers: [DatasourceCommunicationService,DatacauseCommunicationService,DialogCommunicationService]
})
export class DatareportDlistModule {

}
