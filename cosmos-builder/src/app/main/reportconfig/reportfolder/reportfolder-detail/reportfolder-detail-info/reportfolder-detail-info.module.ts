import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReportfolderDetailInfoService } from './reportfolder-detail-info.service';
import { ReportfolderDetailInfoComponent } from './reportfolder-detail-info.component';
import { FormsModule } from '@angular/forms';
import { ReportfolderDetailModifyModule } from '../reportfolder-detail-modify/reportfolder-detail-modify.module';


import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
@NgModule({
    declarations: [
        ReportfolderDetailInfoComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FormModule,
        ButtonModule,
        ReportfolderDetailModifyModule,
    ],
    providers: [ReportfolderDetailInfoService],
    exports: [ReportfolderDetailInfoComponent]
})
export class ReportfolderDetailInfoModule {

}
