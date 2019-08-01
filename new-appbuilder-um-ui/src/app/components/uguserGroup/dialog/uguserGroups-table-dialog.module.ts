import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddUgUserGroupDialogService } from './uguserGroups-table-dialog.service';
import { AddUgUserGroupDialogComponent } from './uguserGroups-table-dialog.component';
import { CommonModule } from '@angular/common';
import {UgUserGroupsTableModule} from '../table/uguserGroups-table.module';

@NgModule({
    declarations: [
        AddUgUserGroupDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        UgUserGroupsTableModule,
        NgZorroAntdModule
    ],
    providers: [AddUgUserGroupDialogService],
    exports: [AddUgUserGroupDialogComponent]
})
export class AddUgUserGroupDialogModule {

}
