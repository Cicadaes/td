import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUgUsersTableComponent } from './add-ugusers-table.component';
import { AddUgUsersTableService } from './add-ugusers-table.service';
import { AddUgUserDialogModule } from '../dialog/add-uguser-dialog.module';
import { DateFormatPipeModule } from '../../../pipes/dateFormat-pipe';
import { AddUgUsersTableRoutingModule } from './add-ugusers-table-routing.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        AddUgUsersTableComponent
    ],
    imports: [
        DateFormatPipeModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        AddUgUserDialogModule,
        AddUgUsersTableRoutingModule,
        NgZorroAntdModule
    ],
    providers: [ AddUgUsersTableService ],
    exports: [ AddUgUsersTableComponent ]
})
export class AddUgUsersTableModule { }
