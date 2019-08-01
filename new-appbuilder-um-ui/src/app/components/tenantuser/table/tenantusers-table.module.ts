import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { TenantUsersTableComponent } from './tenantusers-table.component';
import {TenantUsersTableService} from "./tenantusers-table.service";
import {AddTenantUserDialogModule} from "../dialog/add-tenantuser-dialog.module";
import {DateFormatPipeModule} from "../../../pipes/dateFormat-pipe";
import {TenantusersRoutingModule} from "../tenantusers-routing.module";
import {AddTenantUserFormComponent} from "../form/add-tenantuser-form.component";
import { UMThemeModule } from '../.,/../../../@themes/um-theme.module';


@NgModule({
    declarations: [
        TenantUsersTableComponent
    ],
    imports: [
        DateFormatPipeModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        TenantusersRoutingModule,
        AddTenantUserDialogModule,
        UMThemeModule,
        NgZorroAntdModule
    ],
    providers: [TenantUsersTableService],
    exports: [TenantUsersTableComponent]
})
export class TenantusersTableModule {

}
