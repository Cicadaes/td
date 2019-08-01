import { TenantsTableRoutingModule } from './tenants-table-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantsTableComponent } from './tenants-table.component';
import { TenantsTableService } from './tenants-table.service';
import { AddTenantDialogModule } from '../dialog/add-tenant-dialog.module';
import { DateFormatPipeModule } from '../../../pipes/dateFormat-pipe';
import { NgZorroAntdModule } from 'ng-cosmos-ui';


@NgModule({
  declarations: [
    TenantsTableComponent
  ],
  imports: [
    DateFormatPipeModule,
    TenantsTableRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AddTenantDialogModule,
    NgZorroAntdModule
  ],
  providers: [TenantsTableService],
  exports: [TenantsTableComponent]
})
export class TenantsTableModule {

}
