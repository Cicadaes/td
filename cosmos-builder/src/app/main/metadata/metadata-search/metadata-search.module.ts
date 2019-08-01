import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MetadataSearchService } from './metadata-search.service';
import { MetadataSearchComponent } from './metadata-search.component';


import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';

@NgModule({
    declarations: [
        MetadataSearchComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormModule,
        InputModule,
        ButtonModule,
        SelectModule,
        datePickerModule
    ],
    providers: [MetadataSearchService],
    exports: [MetadataSearchComponent]
})
export class MetadataSearchModule {

}
