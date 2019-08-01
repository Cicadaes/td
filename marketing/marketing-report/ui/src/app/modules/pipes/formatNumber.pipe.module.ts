import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormatNumberPipe } from "../../pipes/formatNumber.pipe";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        FormatNumberPipe
    ],
    exports: [
        FormatNumberPipe
    ],
    providers: []
})

export class FormatNumberPipeModule {

}