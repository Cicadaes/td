import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LimitNumberInputDirective} from './limit-number-input.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        LimitNumberInputDirective,
    ],
    exports: [
        LimitNumberInputDirective,
    ]
})
export class DirectiveModule {
}
