import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { UgUsersTableComponent } from './ugusers-table.component';
import { UgUsersTableService } from "./ugusers-table.service";
import {UgUsersTableRoutingModule} from "./ugusers-table-routing.module";
import {DateFormatPipeModule} from "../../../../pipes/dateFormat-pipe";
import {AddUgUserDialogModule} from "../../../uguser/dialog/add-uguser-dialog.module";

@NgModule({
    declarations: [
        UgUsersTableComponent
    ],
    imports: [
        DateFormatPipeModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        AddUgUserDialogModule,
        UgUsersTableRoutingModule,
        NgZorroAntdModule
        ],
    providers: [UgUsersTableService],
    exports: [UgUsersTableComponent]
})
export class UgUsersTableModule {

}