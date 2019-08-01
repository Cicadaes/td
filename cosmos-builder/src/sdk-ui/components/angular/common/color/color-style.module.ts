import { NgModule, ApplicationRef, ComponentFactoryResolver, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { colorStyleComponent } from './color-style.component'


import { RadioModule} from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { colorPickerModule} from 'ng-cosmos-td-ui/src/business/colorPicker/colorPicker.module';
import { colorPickerStyleModule} from './../colorPicker/color-picker-style.module';


@NgModule({
    declarations: [
        colorStyleComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RadioModule,
        colorPickerModule,
        colorPickerStyleModule
    ],
    exports: [colorStyleComponent],

})
export class colorStyleModule implements OnInit, OnDestroy {
    constructor() {
    }
    ngOnInit() {

    }
    ngOnDestroy() {

    }
}