import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { UsersTableComponent } from './users-table.component';
import { UsersTableService } from './users-table.service';
import { AddUserDialogModule } from '../dialog/add-user-dialog.module';
import { DateFormatPipeModule } from '../../../pipes/dateFormat-pipe';

@NgModule({
    declarations: [
        UsersTableComponent
    ],
    imports: [
        DateFormatPipeModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        AddUserDialogModule,
        NgZorroAntdModule
    ],
    providers: [UsersTableService],
    exports: [UsersTableComponent]
})
export class UsersTableModule {

}
