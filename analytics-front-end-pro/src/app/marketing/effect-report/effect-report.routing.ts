import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EffectReportComponent} from './effect-report.component';
import {TargetAchievementComponent} from './target-achievement/target-achievement.component';
import {FunnelAnalysisComponent} from './funnel-analysis/funnel-analysis.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'report',
        pathMatch: 'full'
    },
    {
        path: 'report',
        component: EffectReportComponent
    },
    {
        path: 'target-achievement',
        component: TargetAchievementComponent
    },
    {
        path: 'funnel-analysis',
        component: FunnelAnalysisComponent
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
export class EffectReportRoutingModule {

}
