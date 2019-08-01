import {NgModule}       from '@angular/core';
import {CommonModule}   from '@angular/common';
import {FormsModule} from '@angular/forms';

import {DatareportPreviewBoxComponent} from "../../../components/datareport/report-preview/report-preview.component";

import {PreviewModule} from "datwill/lib/preview/preview.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PreviewModule
    ],
    declarations: [
        DatareportPreviewBoxComponent
    ],
    exports:[DatareportPreviewBoxComponent],
})
export class DatareportPreviewModule {

}
