import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReportcreateService } from './report-create.service';
import { ReportCreateComponent } from './report-create.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { datePickerModule } from 'ng-cosmos-td-ui/src/base/datePicker/datePicker.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import { ModalModule } from 'ng-cosmos-td-ui/src/base/modal/modal.module';

@NgModule({
    declarations: [
        ReportCreateComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        FormModule,
        InputModule,
        SelectModule,
        datePickerModule,
        ButtonModule,
        ModalModule
    ],
    providers: [ReportcreateService],
    exports: [ReportCreateComponent]
})
export class ReportcreateModule {

}
