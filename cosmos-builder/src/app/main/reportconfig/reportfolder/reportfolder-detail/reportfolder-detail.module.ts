import { NgModule } from '@angular/core';
import { ReportfolderdetailService } from './reportfolder-detail.service';
import { ReportfolderDetailComponent } from './reportfolder-detail.component';
import { FormsModule } from '@angular/forms';
import { ReportfolderDetailInfoModule } from './reportfolder-detail-info/reportfolder-detail-info.module';
import { ReportfolderDetailListModule } from './reportfolder-detail-list/reportfolder-detail-list.module';
import { ReportfolderDetailOperateModule } from './reportfolder-detail-operate/reportfolder-detail-operate.module';
import { ReportfolderDetailAdvancedSearchModule } from './reportfolder-detail-advanced-search/reportfolder-detail-advanced-search.module';
import { ReportfolderDetailRoutingModule } from './reportfolder-detail-routing.module';
import { ReportAdvancedSearchService } from '../../report/report-advanced-search/report-advanced-search.service';
import { ReportlistService } from '../../report/report-list/report-list.service';
import { ReportfolderlistService } from '../reportfolder-list/reportfolder-list.service';

@NgModule({
    declarations: [
        ReportfolderDetailComponent
    ],
    imports: [
        FormsModule,
        ReportfolderDetailInfoModule,
        ReportfolderDetailListModule,
        ReportfolderDetailOperateModule,
        ReportfolderDetailAdvancedSearchModule,
        ReportfolderDetailRoutingModule
    ],
    providers: [ReportfolderdetailService,
        ReportAdvancedSearchService,
        ReportlistService,
        ReportfolderlistService]
})
export class ReportfolderdetailModule {

}
