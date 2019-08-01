import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {InsightsComponent} from './insights.component';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {InsightsTableComponent} from './insights-table/insights-table.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
    ],
    exports: [
        InsightsComponent,
    ],
    declarations: [InsightsComponent, InsightsTableComponent]
})
export class InsightsModule {
}
