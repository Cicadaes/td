import {RouterModule} from "@angular/router";
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { UgRolesTableComponent } from './orgroles-table.component';
import { UgRolesTableService } from "./orgroles-table.service";
import {UgRolesTableRoutingModule} from "./orgroles-table-routing.module";


@NgModule({
    declarations: [
        UgRolesTableComponent
    ],
    imports: [
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule,
        UgRolesTableRoutingModule,
],
    providers: [UgRolesTableService],
    exports: [UgRolesTableComponent]
})
export class UgRolesTableModule {

}