import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LimitNumberInputDirective } from "../../directives/limitNumberInput.directive";

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        LimitNumberInputDirective
    ],
    exports: [
        LimitNumberInputDirective
    ],
    providers: []
})

export class LimitNumberInputDirectiveModule {

}