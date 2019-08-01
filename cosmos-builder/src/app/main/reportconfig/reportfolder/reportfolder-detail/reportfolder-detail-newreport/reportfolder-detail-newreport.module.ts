import { NgModule } from '@angular/core';
import { ReportfolderDetailNewreportService } from './reportfolder-detail-newreport.service';
import { ReportfolderDetailNewreportComponent } from './reportfolder-detail-newreport.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { ModalModule } from 'ng-cosmos-td-ui/src/base/modal/modal.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
@NgModule({
    declarations: [
        ReportfolderDetailNewreportComponent
    ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        FormModule,
        InputModule,
        ModalModule,
        ButtonModule
    ],
    providers: [ReportfolderDetailNewreportService],
    exports: [ReportfolderDetailNewreportComponent]
})
export class ReportfolderDetailNewreportModule {

}
