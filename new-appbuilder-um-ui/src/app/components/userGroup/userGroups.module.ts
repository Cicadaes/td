import { UserGroupsRoutingModule } from './userGroups-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { UserGroupsService } from './userGroups.service';
import { UserGroupsComponent } from './userGroups.component';
import { CommonModule } from '@angular/common';
import { MoreSearchModule} from '../../main/more-search/more-search.module';
import { AddUserGroupDialogModule } from './dialog/add-userGroup-dialog.module';
import { UserGroupsTableModule } from './table/userGroups-table.module';
import { InnerMenuModule } from '../../main/inner-menu/inner-menu.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        UserGroupsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        UserGroupsRoutingModule,
        MoreSearchModule,
        InnerMenuModule,
        UserGroupsTableModule,
        AddUserGroupDialogModule,
        NgZorroAntdModule
    ],
    providers: [UserGroupsService],
    exports: [UserGroupsComponent]
})
export class UserGroupsModule { }
