import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { UgUsersTableDialogService } from './ugusers-table-dialog.service';
import { UgUsersTableDialogComponent } from './ugusers-table-dialog.component';
import { CommonModule } from '@angular/common';
import { AddUgUsersTableModule } from '../table/add-ugusers-table.module';


@NgModule({
    declarations: [
        UgUsersTableDialogComponent
    ],
    imports: [
        CommonModule,
        AddUgUsersTableModule,
        FormsModule,
        NgZorroAntdModule
    ],
    providers: [UgUsersTableDialogService],
    exports: [UgUsersTableDialogComponent]
})
export class UgUsersTableDialogModule { }

