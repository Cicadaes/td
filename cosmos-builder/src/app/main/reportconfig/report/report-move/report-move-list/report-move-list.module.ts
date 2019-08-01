import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReportMoveListService } from './report-move-list.service';
import { ReportMoveListComponent } from './report-move-list.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';

import { TableModule } from 'ng-cosmos-td-ui/src/base/table/table.module';
import { RadioModule } from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { PaginationModule } from 'ng-cosmos-td-ui/src/base/pagination/pagination.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';

@NgModule({
    declarations: [
        ReportMoveListComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        RadioModule,
        PaginationModule,
        InputModule
    ],
    providers: [ReportMoveListService],
    exports: [ReportMoveListComponent]
})
export class ReportmovelistModule {

}
