import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import {AuthLicencesTableComponent} from './auth-licences-table.component';
import {AuthLicencesTableService} from "./auth-licences-table.service";
import {AuthLicencesTableRoutingModule} from "./auth-licences-table-routing.module";
import {DateFormatPipeModule} from "../../../pipes/dateFormat-pipe";
import {InstanceLicencePageModule} from "../instance/instance-licence-page.module";

@NgModule({
    declarations: [
        AuthLicencesTableComponent
    ],
    imports: [
        DateFormatPipeModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        AuthLicencesTableRoutingModule,
        InstanceLicencePageModule,
        NgZorroAntdModule
    ],
    providers: [AuthLicencesTableService],
    exports: [AuthLicencesTableComponent]
})
export class AuthLicencesTableModule {

}