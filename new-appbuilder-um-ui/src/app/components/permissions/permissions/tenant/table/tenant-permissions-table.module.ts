import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantPermissionsTableComponent } from './tenant-permissions-table.component';
import { TenantPermissionsTableService } from './tenant-permissions-table.service';
import { TenantPermissionsTableRoutingModule } from './tenant-permissions-table-routing.module';
import { DateFormatPipeModule } from '../../../../../pipes/dateFormat-pipe';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        TenantPermissionsTableComponent
    ],
    imports: [
        RouterModule,
        DateFormatPipeModule,
        TenantPermissionsTableRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
    ],
    providers: [TenantPermissionsTableService],
    exports: [TenantPermissionsTableComponent]
})
export class TenantPermissionsTableModule {

}
