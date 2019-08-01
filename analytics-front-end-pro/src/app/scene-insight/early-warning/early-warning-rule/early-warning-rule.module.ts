import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {NgZorroAntdModule} from 'ng-zorro-antd';

import { TabListModule } from 'src/app/common/tab-list/tab-list.module';
import { FormsModule } from '@angular/forms';
import { EarlyWarningRuleComponent } from './early-warning-rule.component';
import { BusinessRuleDefinitionComponent } from './business-rule-definition/business-rule-definition.component';
import { MktRuleDefinitionComponent } from './mkt-rule-definition/mkt-rule-definition.component';


const appRoutes: Routes = [
    {
        path: '',
        component: EarlyWarningRuleComponent,
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
        EarlyWarningRuleComponent,
        BusinessRuleDefinitionComponent,
        MktRuleDefinitionComponent
    ]
})
export class EarlyWarningRuleModule {
}
