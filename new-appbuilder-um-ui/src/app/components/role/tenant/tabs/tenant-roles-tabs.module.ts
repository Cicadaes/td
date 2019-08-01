import { TenantRolesTabsRoutingModule } from './tenant-roles-tabs-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { TenantRolesTabsComponent } from './tenant-roles-tabs.component';
import { TenantRolesTabsService } from './tenant-roles-tabs.service';
import { UserAuthModule } from '../../user-auth/user-auth.module';
import { UserGroupAuthModule } from '../../user-group-auth/user-group-auth.module';
import { DeptAuthModule } from '../../dept-auth/dept-auth.module';
import { FuncAuthHomeModule } from '../../func-auth-home/func-auth-home.module';
import { DateFormatPipeModule } from '../../../../pipes/dateFormat-pipe';

@NgModule({
    declarations: [
        TenantRolesTabsComponent
    ],
    imports: [
        DateFormatPipeModule,
        TenantRolesTabsRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        UserAuthModule,
        UserGroupAuthModule,
        DeptAuthModule,
        FuncAuthHomeModule,
        NgZorroAntdModule
    ],
    providers: [TenantRolesTabsService],
    exports: [TenantRolesTabsComponent]
})
export class TenantRolesTabsModule {

}
