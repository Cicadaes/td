import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { SmartReportComponent }  from '../../report.component';
import { SmartIndexComponent }  from '../../smart-indexs/index.component';
import { PreviewIndexComponent }  from '../../smart-preview/preview.component';

import { DatareportMlistModule } from '../../smart-reports/support/report-modules/mlist/mlist.module';
import { DatareportAlistModule } from '../../smart-reports/support/report-modules/alist/alist.module';
import { DatareportDlistModule } from '../../smart-reports/support/report-modules/dlist/dlist.module';
import { DatareportTlistModule } from '../../smart-reports/support/report-modules/tlist/tlist.module';

import {SmartModule} from "../../smart-reports/smart.module";
import {PreviewModule} from "../../smart-reports/preview/preview.module";

import { SmartReportRoutingModule } from '../../routers/report/report-routing.module';


@NgModule({
    imports:      [ CommonModule, FormsModule, SmartReportRoutingModule, DatareportMlistModule,DatareportAlistModule,DatareportDlistModule,DatareportTlistModule,SmartModule,PreviewModule ],
    declarations: [
        SmartReportComponent,
        SmartIndexComponent,
        PreviewIndexComponent
    ],
    exports:[SmartReportComponent],

})
export class SmartReportModule {  }