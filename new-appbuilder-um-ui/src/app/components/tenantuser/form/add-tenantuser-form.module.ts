import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddTenantUserFormComponent } from './add-tenantuser-form.component';
import { DateSingleModule } from '../../../main/date/date-single/date-single.module';
// import { SelectTreeModule } from '../../../main/select/select-tree/select-tree.module';
import { AddTenantuserFormService } from './add-tenantuser-form.service';
import { OrganizationTreeModule } from '../.,/../../../main/tree/organization-tree/organization-tree.module';
import { UMThemeModule } from '../.,/../../../@themes/um-theme.module';

@NgModule({
  declarations: [
    AddTenantUserFormComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    DateSingleModule,
    // SelectTreeModule,
    OrganizationTreeModule,
    UMThemeModule.forRoot(),
    NgZorroAntdModule
  ],
  providers: [AddTenantuserFormService],
  exports: [AddTenantUserFormComponent]
})
export class AddTenantUserFormModule {

}
