import { NgModule } from '@angular/core';
import { ReportoperateService } from './report-operate.service';
import { ReportOperateComponent } from './report-operate.component';
import { FormsModule } from '@angular/forms';
import { ReportcreateModule } from '../report-create/report-create.module';

import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';

@NgModule({
    declarations: [
        ReportOperateComponent
    ],
    imports: [
        FormsModule,
        ButtonModule,
        ReportcreateModule
    ],
    providers: [ReportoperateService],
    exports: [ReportOperateComponent]
})
export class ReportoperateModule {

}
