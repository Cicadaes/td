import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from './report.service';
import { ReportComponent } from './report.component';
import { ReportlistModule } from './report-list/report-list.module';
import { ReportoperateModule } from './report-operate/report-operate.module';
import { ReportAdvancedSearchModule } from './report-advanced-search/report-advanced-search.module';

@NgModule({
    declarations: [
        ReportComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReportlistModule,
        ReportoperateModule,
        ReportAdvancedSearchModule
    ],
    providers: [ReportService],
    exports: [ReportComponent]
})
export class ReportModule {

}
