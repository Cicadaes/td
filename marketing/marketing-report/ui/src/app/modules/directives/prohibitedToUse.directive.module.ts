import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProhibitedToUseDirective } from "../../directives/prohibitedToUse.directive";

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ProhibitedToUseDirective
    ],
    exports: [
        ProhibitedToUseDirective
    ],
    providers: []
})

export class ProhibitedToUseDirectiveModule {

}