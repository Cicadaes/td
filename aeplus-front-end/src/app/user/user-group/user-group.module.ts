import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {RouterModule} from '@angular/router';

import {UserGroupComponent} from './user-group.component';
import {InsightsModule} from '../insights/insights.module';
import {InsightsComponent} from '../insights/insights.component';
import {NumberToThousandsPipeModule} from '../../../pipes/number-to-thousands-pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        InsightsModule,
        NumberToThousandsPipeModule,
        RouterModule.forChild([{
            path: '',
            component: UserGroupComponent
        }, {
            path: 'child',
            component: UserGroupComponent
        }, {
            path: 'insights',
            component: InsightsComponent
        }]),
    ],
    declarations: [
        UserGroupComponent,
    ]
})
export class UserGroupModule {
}
