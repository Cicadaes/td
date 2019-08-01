import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {ChartModule} from '../common/chart/chart.module';
import {BusinessOverviewRoutingModule} from './business-overview.routing';
import {MyReportComponent} from './my-report/my-report.component';
import {SharingReportComponent} from './sharing-report/sharing-report.component';
import {MarketingPlanComponent} from './marketing-plan/marketing-plan.component';
import {BusinessOverviewService} from './business-overview.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        ChartModule,
        BusinessOverviewRoutingModule
    ],
    declarations: [
        MyReportComponent,
        SharingReportComponent,
        MarketingPlanComponent
    ],
    providers: [
        BusinessOverviewService
    ]
})

export class BusinessOverviewModule {

}
