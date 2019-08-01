import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FilterTagsPipe } from "../../pipes/filterTags.pipe";

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        FilterTagsPipe
    ],
    exports: [
        FilterTagsPipe
    ],
    providers: []
})

export class FilterTagsPipeModule {

}