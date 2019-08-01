import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatasourceListService } from './datasource-list.service';
import { DatasourceListComponent } from './datasource-list.component';
import { PipeModule } from '../../../pipes/pipe.module';

import { TableModule } from 'ng-cosmos-td-ui/src/base/table/table.module';

@NgModule({
    declarations: [
        DatasourceListComponent
    ],
    imports: [
        FormsModule,
        RouterModule,
        CommonModule,
        TableModule,
        PipeModule
    ],
    providers: [DatasourceListComponent,DatasourceListService],
    exports: [DatasourceListComponent]
})
export class DatasourceListModule {

}