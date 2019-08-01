import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddOrgUsersTableComponent } from './add-orgusers-table.component';
import { AddOrgUsersTableService } from './add-orgusers-table.service';
import { AddOrgUsersTableRoutingModule } from './add-orgusers-table-routing.module';
import { DateFormatPipeModule } from '../../../../pipes/dateFormat-pipe';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        AddOrgUsersTableComponent
    ],
    imports: [
        DateFormatPipeModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        AddOrgUsersTableRoutingModule,
        NgZorroAntdModule
    ],
    providers: [AddOrgUsersTableService],
    exports: [AddOrgUsersTableComponent]
})
export class AddOrgUsersTableModule { }
