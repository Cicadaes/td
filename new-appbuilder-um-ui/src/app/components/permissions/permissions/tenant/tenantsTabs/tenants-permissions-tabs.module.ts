import { TenantsPermissionsTabsRoutingModule } from './tenants-permissions-tabs-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { TenantsPermissionsTabsComponent } from './tenants-permissions-tabs.component';
import { TenantsPermissionsTabsService } from './tenants-permissions-tabs.service';
import { UserAuthModule } from './user-auth/user-auth.module';
import { FuncAuthModule } from './func-auth/func-auth.module';
import { DateFormatPipeModule } from '../../../../../pipes/dateFormat-pipe';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        TenantsPermissionsTabsComponent
    ],
    imports: [
        DateFormatPipeModule,
        TenantsPermissionsTabsRoutingModule,
        ReactiveFormsModule,
        RouterModule,
        FormsModule,
        CommonModule,
        UserAuthModule,
        FuncAuthModule,
        NgZorroAntdModule
    ],
    providers: [TenantsPermissionsTabsService],
    exports: [TenantsPermissionsTabsComponent]
})
export class TenantsRolesTabsModule {

}
