import { NgModule } from '@angular/core';
import { ReportModifyService } from './report-modify.service';
import { ReportModifyComponent } from './report-modify.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { ModalModule } from 'ng-cosmos-td-ui/src/base/modal/modal.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
@NgModule({
    declarations: [
        ReportModifyComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        FormModule,
        InputModule,
        ModalModule,
        ButtonModule
    ],
    providers: [ReportModifyService],
    exports: [ReportModifyComponent]
})
export class ReportModifyModule {

}
