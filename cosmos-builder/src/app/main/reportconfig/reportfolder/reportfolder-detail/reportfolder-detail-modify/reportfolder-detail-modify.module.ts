import { NgModule } from '@angular/core';
import { ReportfolderDetailModifyService } from './reportfolder-detail-modify.service';
import { ReportfolderDetailModifyComponent } from './reportfolder-detail-modify.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { InputModule } from 'ng-cosmos-td-ui/src/base/input/input.module';
import { ModalModule } from 'ng-cosmos-td-ui/src/base/modal/modal.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
@NgModule({
    declarations: [
        ReportfolderDetailModifyComponent
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
    providers: [ReportfolderDetailModifyService],
    exports: [ReportfolderDetailModifyComponent]
})
export class ReportfolderDetailModifyModule {

}
