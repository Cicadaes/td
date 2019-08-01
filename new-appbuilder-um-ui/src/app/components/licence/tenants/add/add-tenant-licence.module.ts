import { AddTenantLicenceRoutingModule} from './add-tenant-licence-routing.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddTenantLicenceComponent } from './add-tenant-licence.component';
import { AddTenantLicenceService } from './add-tenant-licence.service';
import {AddTenantsLicenceFormModule} from "../form/add-tenants-licence-form.module";
import {TlicencesAttributeTableModule} from "../table/licenceAttribute/tlicences-attribute-table.module";
import {CheckLicenceDialogModule} from "../adddialog/check-licence-dialog.module";

@NgModule({
    declarations: [
        AddTenantLicenceComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        //LicenceBasicInfoModule,
        AddTenantLicenceRoutingModule,
        AddTenantsLicenceFormModule,
        TlicencesAttributeTableModule,
        CheckLicenceDialogModule,
        NgZorroAntdModule
        ],
    providers: [AddTenantLicenceService],
    exports: [AddTenantLicenceComponent]
})
export class AddTenantLicenceModule {

}