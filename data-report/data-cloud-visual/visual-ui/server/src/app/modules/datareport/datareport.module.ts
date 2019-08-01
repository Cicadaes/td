import {NgModule}       from '@angular/core';
import {CommonModule}   from '@angular/common';
import {FormsModule}    from '@angular/forms';


import {DatareportComponent} from '../../components/datareport/datareport.component';

import {DatareportRoutingModule} from '../../routers/datareport/datareport-routing.module';

import {DatareportAlistModule} from "./alist/alist.module";
import {DatareportTlistModule} from "./tlist/tlist.module";
import {DatareportPreviewModule} from "./preview/preview.module";

import {DialogModule,GrowlModule,DropdownModule} from 'primeng/primeng';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DatareportRoutingModule,
        DialogModule,
        GrowlModule,
        DropdownModule,
        DatareportAlistModule,
        DatareportTlistModule,
        DatareportPreviewModule

    ],
    declarations: [
        DatareportComponent
    ],
    providers:[],
    exports:[DialogModule,FormsModule]
})
export class DatareportModule {

}
