import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { OrgUsersTableDialogService } from './orgusers-table-dialog.service';
import { OrgUsersTableDialogComponent } from './orgusers-table-dialog.component';
import { CommonModule } from '@angular/common';
import { AddUgUsersTableModule } from '../../../uguser/table/add-ugusers-table.module';
import { AddOrgUsersTableModule } from '../table/add-orgusers-table.module';


@NgModule({
    declarations: [
        OrgUsersTableDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AddUgUsersTableModule,
        AddOrgUsersTableModule,
        NgZorroAntdModule
    ],
    providers: [OrgUsersTableDialogService],
    exports: [OrgUsersTableDialogComponent]
})
export class OrgUsersTableDialogModule {

}
