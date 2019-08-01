import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import {TenantsLicencesTableComponent} from './tenants-licences-table.component';
import {TenantsLicencesTableService} from "./tenants-licences-table.service";
import {TenantsLicencesTableRoutingModule} from "./tenants-licences-table-routing.module";
import {DateFormatPipeModule} from "../../../../pipes/dateFormat-pipe";

@NgModule({
    declarations: [
        TenantsLicencesTableComponent
    ],
    imports: [
        DateFormatPipeModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        TenantsLicencesTableRoutingModule,
        NgZorroAntdModule
    ],
    providers: [TenantsLicencesTableService],
    exports: [TenantsLicencesTableComponent]
})
export class TenantsLicencesTableModule {

}