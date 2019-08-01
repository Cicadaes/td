import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ChartModule} from '../common/chart/chart.module';
import {BusinessOverviewRoutingModule} from './business-overview.routing';
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
        MarketingPlanComponent
    ],
    providers: [
        BusinessOverviewService
    ]
})

export class BusinessOverviewModule {

}
