import { UserAuthRoutingModule } from './user-auth-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { UserAuthService } from './user-auth.service';
import { UserAuthComponent } from './user-auth.component';
import { CommonModule } from '@angular/common';
import { MoreSearchModule } from '../../../main/more-search/more-search.module';
import { AddUserAuthDialogModule } from './dialog/add-user-auth-dialog.module';
import { UserAuthTableModule } from './table/user-auth-table.module';
import { AddUserDialogModule } from './add-user-dialog/add-user-dialog.module';

@NgModule({
    declarations: [
        UserAuthComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        UserAuthRoutingModule,
        MoreSearchModule,
        UserAuthTableModule,
        AddUserDialogModule,
        AddUserAuthDialogModule,
        NgZorroAntdModule
    ],
    providers: [UserAuthService],
    exports: [UserAuthComponent]
})
export class UserAuthModule {

}
