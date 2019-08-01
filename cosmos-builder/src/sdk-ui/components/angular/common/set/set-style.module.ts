import { NgModule, ApplicationRef, ComponentFactoryResolver, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { setStyleComponent } from './set-style.component'


import { CheckboxModule} from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { RadioModule } from 'ng-cosmos-td-ui/src/base/radio/radio.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';

@NgModule({
    declarations: [
        setStyleComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        CheckboxModule,
        SelectModule,
        InputModule,
        RadioModule
    ],
    exports: [setStyleComponent],

})
export class setStyleModule implements OnInit, OnDestroy {
    constructor() {
    }
    ngOnInit() {

    }
    ngOnDestroy() {

    }
}