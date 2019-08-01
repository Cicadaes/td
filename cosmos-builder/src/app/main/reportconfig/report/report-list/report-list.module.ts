import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReportlistService } from './report-list.service';
import { ReportListComponent } from './report-list.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReportmoveModule } from '../report-move/report-move.module';
import { ReportPublishModule } from '../report-publish/report-publish.module';
import { TableModule } from 'ng-cosmos-td-ui/src/base/table/table.module';
import { ReportModifyModule } from './report-modify/report-modify.module';
import { DropdownModule } from 'ng-cosmos-td-ui/src/base/dropdown/dropdown.module';
@NgModule({
    declarations: [
        ReportListComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        RouterModule,
        ReportmoveModule,
        ReportPublishModule,
        ReportModifyModule,
        DropdownModule
    ],
    providers: [ReportlistService],
    exports: [ReportListComponent]
})
export class ReportlistModule {

}
