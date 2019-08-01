import { NgModule, ApplicationRef, ComponentFactoryResolver, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AxisStyleComponent } from './axis-style.component';

import { CheckboxModule} from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { colorPickerModule} from 'ng-cosmos-td-ui/src/business/colorPicker/colorPicker.module';
import { colorPickerStyleModule} from './../colorPicker/color-picker-style.module';

@NgModule({
    declarations: [
        AxisStyleComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        CheckboxModule,
        colorPickerModule,
        colorPickerStyleModule
    ],
    exports: [AxisStyleComponent],
})

export class AxisStyleModule {

}