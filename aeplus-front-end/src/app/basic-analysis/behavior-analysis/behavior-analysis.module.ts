import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {RouterModule} from '@angular/router';
import {ChartModule} from '../../common/chart/chart.module';

import {BehaviorAnalysisComponent} from './behavior-analysis.component';
import {NumberToThousandsPipeModule} from '../../../pipes/number-to-thousands-pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        RouterModule,
        ChartModule,
        NumberToThousandsPipeModule
    ],
    declarations: [
        BehaviorAnalysisComponent
    ]
})
export class BehaviorAnalysisModule {
}
