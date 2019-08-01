import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { TenantRolesTableComponent } from './tenant-roles-table.component';
import { TenantRolesTableService } from './tenant-roles-table.service';
import { AddRoleDialogModule } from '../../common/dialog/add-role-dialog.module';
import { TenantRolesTabsModule } from '../tabs/tenant-roles-tabs.module';
import { TenantsRolesTabsModule } from '../tenantsTabs/tenants-roles-tabs.module';
import { TenantRolesTableRoutingModule } from './tenant-roles-table-routing.module';
import { DateFormatPipeModule } from '../../../../pipes/dateFormat-pipe';

@NgModule({
    declarations: [
        TenantRolesTableComponent
    ],
    imports: [
        RouterModule,
        DateFormatPipeModule,
        TenantRolesTableRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        TenantRolesTabsModule,
        TenantsRolesTabsModule,
        AddRoleDialogModule,
        NgZorroAntdModule
    ],
    providers: [TenantRolesTableService],
    exports: [TenantRolesTableComponent]
})
export class TenantRolesTableModule {

}
