import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AddUserGroupAuthDialogService } from './add-user-group-auth-dialog.service';
import { AddUserGroupAuthDialogComponent } from './add-user-group-auth-dialog.component';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { MoreSearchModule } from '../../../../main/more-search/more-search.module';
import { UserGroupAuthTableModule } from '../table/user-group-auth-table.module';

@NgModule({
    declarations: [
        AddUserGroupAuthDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MoreSearchModule,
        UserGroupAuthTableModule,
        NgZorroAntdModule
    ],
    providers: [AddUserGroupAuthDialogService],
    exports: [AddUserGroupAuthDialogComponent]
})
export class AddUserGroupAuthDialogModule {

}
