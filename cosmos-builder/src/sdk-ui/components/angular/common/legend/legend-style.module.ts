import { NgModule, ApplicationRef, ComponentFactoryResolver, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LegendStyleComponent } from './legend-style.component'

import { SelectModule} from 'ng-cosmos-td-ui/src/base/select/select.module';
import { RadioModule} from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { colorPickerModule} from 'ng-cosmos-td-ui/src/business/colorPicker/colorPicker.module';
import { colorPickerStyleModule} from './../colorPicker/color-picker-style.module';

@NgModule({
    declarations: [
        LegendStyleComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        SelectModule,
        RadioModule,
        colorPickerModule,
        colorPickerStyleModule
    ],
    exports: [LegendStyleComponent],

})
export class LegendStyleModule implements OnInit, OnDestroy {
    constructor() {
    }
    ngOnInit() {

    }
    ngOnDestroy() {

    }
}