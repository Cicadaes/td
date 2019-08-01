import {EditTenantLicenceRoutingModule} from './edit-tenant-licence-routing.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { EditTenantLicenceComponent } from './edit-tenant-licence.component';
import { EditTenantLicenceService } from './edit-tenant-licence.service';
import {TlicencesAttributeTableModule} from "../table/licenceAttribute/tlicences-attribute-table.module";
import {AddTenantsLicenceFormModule} from "../form/add-tenants-licence-form.module";
import {EditTenantsLicenceFormModule} from "../editForm/edit-tenants-licence-form.module";
import {DateRangeModule} from "../../../../main/date/date-range/date-range.module";

@NgModule({
    declarations: [
        EditTenantLicenceComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        //LicenceBasicInfoModule,
        EditTenantLicenceRoutingModule,
        AddTenantsLicenceFormModule,
        TlicencesAttributeTableModule,
        EditTenantsLicenceFormModule,
        DateRangeModule,
        NgZorroAntdModule
    ],
    providers: [EditTenantLicenceService],
    exports: [EditTenantLicenceComponent]
})
export class EditTenantLicenceModule {

}