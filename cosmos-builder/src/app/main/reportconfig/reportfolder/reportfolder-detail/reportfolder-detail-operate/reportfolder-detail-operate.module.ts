import { NgModule } from '@angular/core';
import { ReportfolderDetailOperateService } from './reportfolder-detail-operate.service';
import { ReportfolderDetailOperateComponent } from './reportfolder-detail-operate.component';
import { FormsModule } from '@angular/forms';
import { ReportfolderDetailNewreportModule } from '../reportfolder-detail-newreport/reportfolder-detail-newreport.module';

import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
@NgModule({
    declarations: [
        ReportfolderDetailOperateComponent
    ],
    imports: [
        FormsModule,
        ButtonModule,
        ReportfolderDetailNewreportModule
    ],
    providers: [ReportfolderDetailOperateService],
    exports: [ReportfolderDetailOperateComponent]
})
export class ReportfolderDetailOperateModule {

}
