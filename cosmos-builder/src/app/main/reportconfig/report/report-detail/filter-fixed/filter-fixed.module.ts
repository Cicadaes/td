import { NgModule } from '@angular/core';
import { filterFixedComponent } from './filter-fixed.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import { CheckCascaderModule } from 'ng-cosmos-td-ui/src/business/checkcascader/checkcascader.module';
import { CascaderModule } from 'ng-cosmos-td-ui/src/base/cascader/cascader.module';
@NgModule({
    declarations: [
        filterFixedComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        InputModule,
        SelectModule,
        datePickerModule,
        ButtonModule,
        CheckCascaderModule,
        CascaderModule,
    ],
    exports: [filterFixedComponent]
})
export class filterFixedModule {

}
