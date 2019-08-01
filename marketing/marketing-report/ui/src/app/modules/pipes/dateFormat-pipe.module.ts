import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DataFormatPipe } from "../../pipes/dateFormat-pipe";


@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        DataFormatPipe
    ],
    exports: [
        DataFormatPipe
    ],
    providers: []
})

export class DateFromatPipeModule {

}