import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { OrgRolesTableDialogService } from './orgroles-table-dialog.service';
import { OrgRolesTableDialogComponent } from './orgroles-table-dialog.component';
import { CommonModule } from '@angular/common';
import { AddOrgRolesTableModule } from '../orgroles/addtable/add-orgroles-table.module';
import { MoreSearchModule } from '../../../main/more-search/more-search.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';


@NgModule({
    declarations: [
        OrgRolesTableDialogComponent
    ],
    imports: [
        CommonModule,
        MoreSearchModule,
        FormsModule,
        AddOrgRolesTableModule,
        NgZorroAntdModule
    ],
    providers: [OrgRolesTableDialogService],
    exports: [OrgRolesTableDialogComponent]
})
export class OrgRolesTableDialogModule { }
