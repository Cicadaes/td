import { NgModule, ApplicationRef, ComponentFactoryResolver, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BgBdStyleComponent } from './BgBd-style.component'

import {  SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import {  CheckboxModule } from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import {  colorPickerModule } from 'ng-cosmos-td-ui/src/business/colorPicker/colorPicker.module';
import { RadioModule} from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { DropdownModule } from 'ng-cosmos-td-ui/src/base/dropdown/dropdown.module';
import { colorPickerStyleModule} from './../colorPicker/color-picker-style.module';

@NgModule({
    declarations: [
        BgBdStyleComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        SelectModule,
        CheckboxModule,
        colorPickerModule,
        RadioModule,
        DropdownModule,
        colorPickerStyleModule
    ],
    exports: [BgBdStyleComponent],

})
export class BgBdStyleModule implements OnInit, OnDestroy {
    constructor() {
    }
    ngOnInit() {

    }
    ngOnDestroy() {

    }
}