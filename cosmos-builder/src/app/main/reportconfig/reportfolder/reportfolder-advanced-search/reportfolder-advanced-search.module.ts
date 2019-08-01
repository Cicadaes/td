import { NgModule } from '@angular/core';
import { ReportfolderAdvancedSearchService } from './reportfolder-advanced-search.service';
import { ReportfolderAdvancedSearchComponent } from './reportfolder-advanced-search.component';
import { ReactiveFormsModule } from '@angular/forms';

import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
@NgModule({
    declarations: [
        ReportfolderAdvancedSearchComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormModule,
        InputModule,
        SelectModule,
        datePickerModule,
        ButtonModule
    ],
    providers: [ReportfolderAdvancedSearchService],
    exports: [ReportfolderAdvancedSearchComponent]
})
export class ReportfolderAdvancedSearchModule {

}
