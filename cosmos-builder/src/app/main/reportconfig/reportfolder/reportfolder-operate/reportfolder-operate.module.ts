import { NgModule } from '@angular/core';
import { CosmosModule } from 'ng-cosmos-td-ui/src/cosmos.module';
import { ReportfolderoperateService } from './reportfolder-operate.service';
import { ReportfolderOperateComponent } from './reportfolder-operate.component';
import { FormsModule } from '@angular/forms';
import { ReportfoldercreateModule } from '../reportfolder-create/reportfolder-create.module';

import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
@NgModule({
    declarations: [
        ReportfolderOperateComponent
    ],
    imports: [
        FormsModule,
        ButtonModule,
        ReportfoldercreateModule,
    ],
    providers: [ReportfolderoperateService],
    exports: [ReportfolderOperateComponent]
})
export class ReportfolderoperateModule {

}
