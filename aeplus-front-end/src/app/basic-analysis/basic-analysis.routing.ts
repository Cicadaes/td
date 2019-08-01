import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomAnalysisComponent} from './custom-analysis/custom-analysis.component';
import {BehaviorAnalysisComponent} from './behavior-analysis/behavior-analysis.component';
import {UserRetentionComponent} from './user-retention/user-retention.component';

const appRoutes: Routes = [
    {
        path: 'user-retention',
        component: UserRetentionComponent
    },
    {
        path: 'behavior-analysis',
        component: BehaviorAnalysisComponent
    },
    {
        path: 'custom-analysis',
        component: CustomAnalysisComponent
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
export class BasicAnalysisRoutingModule {

}
