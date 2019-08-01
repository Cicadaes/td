import { UserAuthRoutingModule } from './user-auth-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { UserAuthService } from './user-auth.service';
import { UserAuthComponent } from './user-auth.component';
import { CommonModule } from '@angular/common';
import { AddUserAuthDialogModule } from './dialog/add-user-auth-dialog.module';
import { UserAuthTableModule } from './table/user-auth-table.module';
import { MoreSearchModule } from '../../../../../../main/more-search/more-search.module';
import { RouterModule } from '@angular/router';

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
        RouterModule,
        AddUserAuthDialogModule,
        NgZorroAntdModule
    ],
    providers: [UserAuthService],
    exports: [UserAuthComponent]
})
export class UserAuthModule {

}
