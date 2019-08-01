import {DetailTenantLicenceRoutingModule} from './detail-tenant-licence-routing.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import {DetailTenantLicenceComponent} from './detail-tenant-licence.component';
import { DetailTenantLicenceService } from './detail-tenant-licence.service';
import {TlicencesAttributeTableModule} from "../table/licenceAttribute/tlicences-attribute-table.module";
import {DateRangeModule} from "../../../../main/date/date-range/date-range.module";
import {DateFormatPipeModule} from "../../../../pipes/dateFormat-pipe";

@NgModule({
    declarations: [
        DetailTenantLicenceComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        DetailTenantLicenceRoutingModule,
        TlicencesAttributeTableModule,
        DateRangeModule,
        DateFormatPipeModule,
        NgZorroAntdModule
    ],
    providers: [DetailTenantLicenceService],
    exports: [DetailTenantLicenceComponent]
})
export class DetailTenantLicenceModule {

}