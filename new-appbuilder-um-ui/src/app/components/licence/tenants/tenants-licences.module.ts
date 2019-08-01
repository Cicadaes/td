import {TenantsLicencesRoutingModule} from './tenants-licences-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { TenantsLicencesService } from './tenants-licences.service';
import { TenantsLicencesComponent } from './tenants-licences.component';
import {CommonModule} from "@angular/common";
import {MoreSearchModule} from "../../../main/more-search/more-search.module";
import {LicencesTableModule} from "../table/licences-table.module";
import {TenantsLicencesTableModule} from "./table/tenants-licences-table.module";
@NgModule({
    declarations: [
        TenantsLicencesComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MoreSearchModule,
        TenantsLicencesRoutingModule,
        LicencesTableModule,
        TenantsLicencesTableModule,
        NgZorroAntdModule
    ],
    providers: [TenantsLicencesService],
    exports: [TenantsLicencesComponent]
})
export class TenantsLicencesModule {

}