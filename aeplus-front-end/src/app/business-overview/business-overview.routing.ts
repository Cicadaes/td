import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MyReportComponent} from './my-report/my-report.component';
import {SharingReportComponent} from './sharing-report/sharing-report.component';
import {MarketingPlanComponent} from './marketing-plan/marketing-plan.component';

const appRoutes: Routes = [
    {
        path: 'my-report',
        component: MyReportComponent
    },
    {
        path: 'sharing-report',
        component: SharingReportComponent
    },
    {
        path: 'marketing-plan',
        component: MarketingPlanComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class BusinessOverviewRoutingModule {

}
