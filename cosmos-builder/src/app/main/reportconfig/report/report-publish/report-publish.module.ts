import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReportPublishService } from './report-publish.service';
import { ReportPublishComponent } from './report-publish.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ng-cosmos-td-ui/src/base/modal/modal.module';
import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { SelectModule } from 'ng-cosmos-td-ui/src/base/select/select.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';

@NgModule({
    declarations: [
        ReportPublishComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ModalModule,
        FormModule,
        SelectModule,
        ButtonModule
    ],
    providers: [ReportPublishService],
    exports: [ReportPublishComponent]
})
export class ReportPublishModule {

}
