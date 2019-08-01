import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EarlyWarningComponent} from './early-warning.component';
import {RouterModule, Routes} from '@angular/router';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {EarlyWarningService} from './early-warning.service';
import { WarningRuleComponent } from './warning-rule/warning-rule.component';
import { WarningHistoryComponent } from './warning-history/warning-history.component';
import { TabListModule } from 'src/app/common/tab-list/tab-list.module';
import { FormsModule } from '@angular/forms';

const appRoutes: Routes = [
    {
        path: '',
        component: EarlyWarningComponent,
        children: [
            {
                path: '',
                redirectTo: 'warning-rule',
                pathMatch: 'full'
            },
            {
                path: 'warning-rule',
                component: WarningRuleComponent
            },
            {
                path: 'warning-history',
                component: WarningHistoryComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(appRoutes),
        NgZorroAntdModule,
        TabListModule
    ],
    declarations: [
        EarlyWarningComponent,
        WarningRuleComponent,
        WarningHistoryComponent
    ],
    providers: [EarlyWarningService]
})
export class EarlyWarningModule {
}
