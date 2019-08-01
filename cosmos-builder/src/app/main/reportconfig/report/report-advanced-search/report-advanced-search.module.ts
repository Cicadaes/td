import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReportAdvancedSearchService } from './report-advanced-search.service';
import { ReportAdvancedSearchComponent } from './report-advanced-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';

@NgModule({
    declarations: [
        ReportAdvancedSearchComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormModule,
        InputModule,
        SelectModule,
        datePickerModule,
        ButtonModule
    ],
    providers: [ReportAdvancedSearchService],
    exports: [ReportAdvancedSearchComponent]
})
export class ReportAdvancedSearchModule {

}
