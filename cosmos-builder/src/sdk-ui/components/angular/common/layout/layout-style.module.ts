import { NgModule, ComponentFactoryResolver ,OnInit, OnDestroy } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from './layout-style.component';
import { BgBdStyleModule } from '../bgAndBorder/BgBd-style.module';

import {  CheckboxModule } from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { RadioModule} from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { InputModule} from 'ng-cosmos-td-ui/src/base/input/input.module';
import { InputNumberModule} from 'ng-cosmos-td-ui/src/base/inputNumber/inputNumber.module';
@NgModule({
    declarations: [
        LayoutComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        BgBdStyleModule,
        CheckboxModule,
        RadioModule,
        InputModule,
        InputNumberModule
    ],
    exports: [ LayoutComponent]
})
export class LayoutModule implements OnInit, OnDestroy {
    constructor() {
    }
    ngOnInit() {

    }
    ngOnDestroy() {

    }
}