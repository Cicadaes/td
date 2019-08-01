import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { UgRolesTableDialogService } from './ugroles-table-dialog.service';
import { UgRolesTableDialogComponent } from './ugroles-table-dialog.component';
import { CommonModule } from '@angular/common';
import { AddUgRolesTableModule } from '../table/add-ugroles-table.module';
import { MoreSearchModule } from '../../../main/more-search/more-search.module';


@NgModule({
    declarations: [
        UgRolesTableDialogComponent
    ],
    imports: [
        CommonModule,
        MoreSearchModule,
        AddUgRolesTableModule,
        FormsModule,
        NgZorroAntdModule
    ],
    providers: [UgRolesTableDialogService],
    exports: [UgRolesTableDialogComponent]
})
export class UgRolesTableDialogModule {

}
