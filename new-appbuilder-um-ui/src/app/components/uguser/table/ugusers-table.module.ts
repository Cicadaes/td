import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UgUsersTableComponent } from './ugusers-table.component';
import { UgUsersTableService } from './ugusers-table.service';
import { AddUgUserDialogModule } from '../dialog/add-uguser-dialog.module';
import { DateFormatPipeModule } from '../../../pipes/dateFormat-pipe';
import { UgUsersTableRoutingModule } from './ugusers-table-routing.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        UgUsersTableComponent
    ],
    imports: [
        DateFormatPipeModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        // AddUgUserDialogModule,
        UgUsersTableRoutingModule,
        NgZorroAntdModule
    ],
    providers: [UgUsersTableService],
    exports: [UgUsersTableComponent]
})
export class UgUsersTableModule { }
