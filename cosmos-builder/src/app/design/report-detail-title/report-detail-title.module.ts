import { NgModule } from '@angular/core';
import { ReportDetailTitleService } from './report-detail-title.service';
import { ReportDetailTitleComponent } from './report-detail-title.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TooltipModule } from 'ng-cosmos-td-ui/src/base/tooltip/tooltip.module';
import { SwitchModule } from 'ng-cosmos-td-ui/src/base/switch/switch.module';

@NgModule({
    declarations: [
        ReportDetailTitleComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TooltipModule,
        SwitchModule,
    ],
    providers: [ReportDetailTitleService],
    exports: [ReportDetailTitleComponent]
})
export class ReportDetailTitleModule {

}
