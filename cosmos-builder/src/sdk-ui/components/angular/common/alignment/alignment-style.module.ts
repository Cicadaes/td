import { NgModule, ApplicationRef, ComponentFactoryResolver, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { alignmentStyleComponent } from './alignment-style.component'


import { CheckboxModule} from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';
import { RadioModule} from 'ng-cosmos-td-ui/src/base/radio/radio.module';

@NgModule({
    declarations: [
        alignmentStyleComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        CheckboxModule,
        RadioModule
    ],
    exports: [alignmentStyleComponent],

})
export class alignmentStyleModule implements OnInit, OnDestroy {
    constructor() {
    }
    ngOnInit() {

    }
    ngOnDestroy() {

    }
}