import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MetadataStep1InfoComponent } from './metadata-step1-info.component';

import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';

@NgModule({
    declarations: [
        MetadataStep1InfoComponent
    ],
    imports: [
        ButtonModule,
        FormModule,
        InputModule,
        SelectModule,
        ReactiveFormsModule,
        CommonModule
    ],
    exports: [MetadataStep1InfoComponent]
})
export class MetadataStep1InfoModule {

}