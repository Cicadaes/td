import { TenantsRoutingModule } from './tenants-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TenantsService } from './tenants.service';
import { TenantsComponent } from './tenants.component';
import { CommonModule } from '@angular/common';
import { MoreSearchModule } from '../../main/more-search/more-search.module';
import { AddTenantDialogModule } from './dialog/add-tenant-dialog.module';
import { TenantsTableModule } from './table/tenants-table.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        TenantsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TenantsRoutingModule,
        MoreSearchModule,
        NgZorroAntdModule,
        TenantsTableModule,
        AddTenantDialogModule,
    ],
    providers: [ TenantsService ],
    exports: [ TenantsComponent ]
})
export class TenantsModule { }
