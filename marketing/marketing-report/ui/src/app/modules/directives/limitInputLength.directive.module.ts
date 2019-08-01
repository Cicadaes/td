import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LimitInputLengthDirective } from "../../directives/limitInputLength.directive";


@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        LimitInputLengthDirective
    ],
    exports: [
        LimitInputLengthDirective
    ],
    providers: []
})

export class LimitInputLengthDirectiveModule {

}