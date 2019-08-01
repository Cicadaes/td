import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReportfolderlistService } from './reportfolder-list.service';
import { ReportfolderListComponent } from './reportfolder-list.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'

import { TableModule } from 'ng-cosmos-td-ui/src/base/table/table.module';
@NgModule({
    declarations: [
        ReportfolderListComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        RouterModule
    ],
    providers: [ReportfolderlistService],
    exports: [ReportfolderListComponent]
})
export class ReportfolderlistModule {

}
