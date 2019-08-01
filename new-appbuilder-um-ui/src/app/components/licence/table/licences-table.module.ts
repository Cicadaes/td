import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import {LicencesTableComponent} from './licences-table.component';
import {LicencesTableService} from "./licences-table.service";
import {LicencesTableRoutingModule} from "./licences-table-routing.module";
import {DateFormatPipeModule} from "../../../pipes/dateFormat-pipe";

@NgModule({
    declarations: [
        LicencesTableComponent
    ],
    imports: [
        DateFormatPipeModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        LicencesTableRoutingModule,
        NgZorroAntdModule
        ],
    providers: [LicencesTableService],
    exports: [LicencesTableComponent]
})
export class LicencesTableModule {

}