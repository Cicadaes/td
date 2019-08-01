import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGroupsTableComponent } from './userGroups-table.component';
import { UserGroupsTableService } from './userGroups-table.service';
import { AddUserGroupDialogModule } from '../dialog/add-userGroup-dialog.module';
import { DateFormatPipeModule } from '../../../pipes/dateFormat-pipe';
import { UserGroupsRoutingModule } from '../userGroups-routing.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        UserGroupsTableComponent
    ],
    imports: [
        DateFormatPipeModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        UserGroupsRoutingModule,
        AddUserGroupDialogModule,
        NgZorroAntdModule
    ],
    providers: [UserGroupsTableService],
    exports: [UserGroupsTableComponent]
})
export class UserGroupsTableModule { }
