import { RolesRoutingModule } from './roles-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { RolesService } from './roles.service';
import { RolesComponent } from './roles.component';
import { CommonModule } from '@angular/common';
import { MoreSearchModule } from '../../main/more-search/more-search.module';
import { SuperRolesTableModule } from './super/table/super-roles-table.module';
import { TenantRolesTableModule } from './tenant/table/tenant-roles-table.module';
import { AddRoleDialogModule } from './common/dialog/add-role-dialog.module';

@NgModule({
    declarations: [
        RolesComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RolesRoutingModule,
        MoreSearchModule,
        SuperRolesTableModule,
        TenantRolesTableModule,
        AddRoleDialogModule,
        NgZorroAntdModule
    ],
    providers: [RolesService],
    exports: [RolesComponent]
})

export class RolesModule {

}
