import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SystemSecurityConfigRoutingModule } from './system-security-config-routing.module';
import { SystemSecurityConfigComponent } from './system-security-config.component';
import { DirectiveModule } from '../../common/directive/directive.module';

@NgModule({
    imports: [
        CommonModule,
        NgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule,
        SystemSecurityConfigRoutingModule,
        DirectiveModule
    ],
    declarations: [
        SystemSecurityConfigComponent
    ]
})
export class SystemSecurityConfigModule { }
