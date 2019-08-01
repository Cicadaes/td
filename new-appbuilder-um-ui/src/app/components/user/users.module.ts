import { UsersRoutingModule } from './users-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { UsersService } from './users.service';
import { UsersComponent } from './users.component';
import { CommonModule } from '@angular/common';
import { MoreSearchModule } from '../../main/more-search/more-search.module';
import { AddUserDialogModule } from './dialog/add-user-dialog.module';
import { UsersTableModule } from './table/users-table.module';

@NgModule({
    declarations: [
        UsersComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MoreSearchModule,
        UsersTableModule,
        AddUserDialogModule,
        NgZorroAntdModule,
        UsersRoutingModule
    ],
    providers: [UsersService],
    exports: [UsersComponent]
})
export class UsersModule {
}
