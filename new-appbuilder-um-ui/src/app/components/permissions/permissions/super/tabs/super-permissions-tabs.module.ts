import { SuperPermissionsTabsRoutingModule } from './super-permissions-tabs-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { SuperPermissionsTabsComponent } from './super-permissions-tabs.component';
import { SuperPermissionsTabsService } from './super-permissions-tabs.service';
import { UserAuthModule } from '../../../permissionsDetail/user-auth/user-auth.module';
import { FuncAuthModule } from '../../../permissionsDetail/func-auth/func-auth.module';
import { DateFormatPipeModule } from '../../../../../pipes/dateFormat-pipe';

@NgModule({
    declarations: [
        SuperPermissionsTabsComponent
    ],
    imports: [
        DateFormatPipeModule,
        SuperPermissionsTabsRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        UserAuthModule,
        FuncAuthModule,
        NgZorroAntdModule
    ],
    providers: [SuperPermissionsTabsService],
    exports: [SuperPermissionsTabsComponent]
})
export class SuperPermissionsTabsModule {

}
