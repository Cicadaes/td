import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportfoldercreateService } from './reportfolder-create.service';
import { ReportfolderCreateComponent } from './reportfolder-create.component';
import { ReactiveFormsModule } from '@angular/forms';

import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { ModalModule } from 'ng-cosmos-td-ui/src/base/modal/modal.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
@NgModule({
    declarations: [
        ReportfolderCreateComponent
    ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        FormModule,
        InputModule,
        ModalModule,
        ButtonModule
    ],
    providers: [ReportfoldercreateService],
    exports: [ReportfolderCreateComponent]
})
export class ReportfoldercreateModule {

}
