import { NgModule, ApplicationRef, ComponentFactoryResolver, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { heightStyleComponent } from './height-style.component'


import { CheckboxModule} from 'ng-cosmos-td-ui/src/base/checkbox/checkbox.module';

@NgModule({
    declarations: [
        heightStyleComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        CheckboxModule,
    ],
    exports: [heightStyleComponent],

})
export class heightStyleModule implements OnInit, OnDestroy {
    constructor() {
    }
    ngOnInit() {

    }
    ngOnDestroy() {

    }
}