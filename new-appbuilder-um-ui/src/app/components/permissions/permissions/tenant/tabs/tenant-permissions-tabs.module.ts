import { TenantPermissionsTabsRoutingModule } from './tenant-permissions-tabs-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantPermissionsTabsComponent } from './tenant-permissions-tabs.component';
import { TenantPermissionsTabsService } from './tenant-permissions-tabs.service';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { DateFormatPipeModule } from '../../../../../pipes/dateFormat-pipe';
import { UserAuthModule } from '../../../permissionsDetail/user-auth/user-auth.module';
import { UserGroupAuthModule } from '../../../permissionsDetail/user-group-auth/user-group-auth.module';
import { DeptAuthModule } from '../../../permissionsDetail/dept-auth/dept-auth.module';
import { FuncAuthModule } from '../../../permissionsDetail/func-auth/func-auth.module';
import { RolePermissionComponent } from './role-permission/role-permission.component';
@NgModule({
    declarations: [
        TenantPermissionsTabsComponent,
        RolePermissionComponent
    ],
    imports: [
        DateFormatPipeModule,
        TenantPermissionsTabsRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        UserAuthModule,
        UserGroupAuthModule,
        DeptAuthModule,
        FuncAuthModule,
        NgZorroAntdModule
    ],
    providers: [TenantPermissionsTabsService],
    exports: [TenantPermissionsTabsComponent]
})
export class TenantPermissionsTabsModule {

}
