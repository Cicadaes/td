import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BasicAnalysisRoutingModule} from './basic-analysis.routing';
import {CustomAnalysisModule} from './custom-analysis/custom-analysis.module';
import {BehaviorAnalysisModule} from './behavior-analysis/behavior-analysis.module';
import {UserRetentionModule} from './user-retention/user-retention.module';

@NgModule({
    imports: [
        CommonModule,
        BasicAnalysisRoutingModule,
        CustomAnalysisModule,
        BehaviorAnalysisModule,
        UserRetentionModule,
    ],
    declarations: []
})
export class BasicAnalysisModule {
}
