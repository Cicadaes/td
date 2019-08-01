import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserProfileComponent} from './user-profile.component';
import {UserProfileRoutingModule} from './user-profile.routing';
import {BaseInfoComponent} from './base-info/base-info.component';
import {IndexAnalysisComponent} from './index-analysis/index-analysis.component';
import {BehaviorTrajectoryComponent} from './behavior-trajectory/behavior-trajectory.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {ChartModule} from '../../common/chart/chart.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        ChartModule,
        UserProfileRoutingModule
    ],
    declarations: [
        UserProfileComponent,
        BaseInfoComponent,
        IndexAnalysisComponent,
        BehaviorTrajectoryComponent
    ]
})
export class UserProfileModule {
}
