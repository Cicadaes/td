import { NgModule } from '@angular/core';
import { ReportfolderDetailAdvancedSearchService } from './reportfolder-detail-advanced-search.service';
import { ReportfolderDetailAdvancedSearchComponent } from './reportfolder-detail-advanced-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
@NgModule({
    declarations: [
        ReportfolderDetailAdvancedSearchComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputModule
    ],
    providers: [ReportfolderDetailAdvancedSearchService],
    exports: [ReportfolderDetailAdvancedSearchComponent]
})
export class ReportfolderDetailAdvancedSearchModule {

}
