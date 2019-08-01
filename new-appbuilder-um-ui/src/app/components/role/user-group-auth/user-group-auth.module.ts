import { UserGroupAuthRoutingModule } from './user-group-auth-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { UserGroupAuthService } from './user-group-auth.service';
import { UserGroupAuthComponent } from './user-group-auth.component';
import {CommonModule} from '@angular/common';
import {MoreSearchModule} from '../../../main/more-search/more-search.module';
import {AddUserGroupAuthDialogModule} from './dialog/add-user-group-auth-dialog.module';
import {UserGroupAuthTableModule} from './table/user-group-auth-table.module';

@NgModule({
    declarations: [
        UserGroupAuthComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        UserGroupAuthRoutingModule,
        MoreSearchModule,
        UserGroupAuthTableModule,
        AddUserGroupAuthDialogModule,
        NgZorroAntdModule
    ],
    providers: [UserGroupAuthService],
    exports: [UserGroupAuthComponent]
})
export class UserGroupAuthModule {

}
