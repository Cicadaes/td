import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UgUserGroupsTableComponent } from './uguserGroups-table.component';
import { UgUserGroupsTableService } from './uguserGroups-table.service';
import { DateFormatPipeModule } from '../../../pipes/dateFormat-pipe';
import { MoreSearchModule } from '../../../main/more-search/more-search.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        UgUserGroupsTableComponent
    ],
    imports: [
        DateFormatPipeModule,
        ReactiveFormsModule,
        MoreSearchModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
    ],
    providers: [UgUserGroupsTableService],
    exports: [UgUserGroupsTableComponent]
})
export class UgUserGroupsTableModule {

}
