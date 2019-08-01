import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { textLinkComponent } from './text-style-link.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ModalModule } from 'ng-cosmos-td-ui/src/base/modal/modal.module';
import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import { CheckboxModule } from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';


import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
import { CheckCascaderModule } from 'ng-cosmos-td-ui/src/business/checkcascader/checkcascader.module';

@NgModule({
    declarations: [
        textLinkComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ModalModule,
        FormModule,
        InputModule,
        SelectModule,
        ButtonModule,
        CheckboxModule
        ],
    exports: [textLinkComponent]
})
export class textLinkModule {

}
