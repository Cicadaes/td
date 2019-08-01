import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MarketingPlanComponent} from './marketing-plan/marketing-plan.component';

const appRoutes: Routes = [
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
