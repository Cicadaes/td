import {RouterModule} from "@angular/router";
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { SuperPermissionsTableComponent } from './super-permissions-table.component';
import { superPermissionsTableService } from "./super-permissions-table.service";
import {SuperPermissionsTabsModule} from "../tabs/super-permissions-tabs.module";
import {SuperPermissionsTableRoutingModule} from "./super-permissions-table-routing.module";

@NgModule({
    declarations: [
        SuperPermissionsTableComponent
    ],
    imports: [
        RouterModule,
        SuperPermissionsTableRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        SuperPermissionsTabsModule,
        NgZorroAntdModule
    ],
    providers: [superPermissionsTableService],
    exports: [SuperPermissionsTableComponent]
})
export class SuperRolesTableModule {

}