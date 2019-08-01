import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LimitInputTextDirective} from './limit-input-text.directive';
import {LimitNumberInputDirective} from './limit-number-input.directive';
import { LimitTextareaTextDirective } from './limit-textarea-text.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        LimitInputTextDirective,
        LimitNumberInputDirective,
        LimitTextareaTextDirective
    ],
    exports: [
        LimitInputTextDirective,
        LimitNumberInputDirective,
        LimitTextareaTextDirective
    ]
})
export class DirectiveModule {
}
