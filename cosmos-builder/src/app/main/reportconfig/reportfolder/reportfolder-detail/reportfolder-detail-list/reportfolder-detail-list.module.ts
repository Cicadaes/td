import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReportfolderDetailListService } from './reportfolder-detail-list.service';
import { ReportfolderDetailListComponent } from './reportfolder-detail-list.component';
import { FormsModule } from '@angular/forms';
import { ReportmoveModule } from '../../../report/report-move/report-move.module';
import { ReportPublishModule } from '../../../report/report-publish/report-publish.module';
import { TableModule } from 'ng-cosmos-td-ui/src/base/table/table.module';
import { ReportModifyModule } from '../../../report/report-list/report-modify/report-modify.module';
import { DropdownModule } from 'ng-cosmos-td-ui/src/base/dropdown/dropdown.module';
@NgModule({
    declarations: [
        ReportfolderDetailListComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ReportmoveModule,
        ReportPublishModule,
        ReportModifyModule,
        DropdownModule
    ],
    providers: [ReportfolderDetailListService],
    exports: [ReportfolderDetailListComponent]
})
export class ReportfolderDetailListModule {

}
