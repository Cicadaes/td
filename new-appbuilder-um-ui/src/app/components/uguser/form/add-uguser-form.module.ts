import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUgUserFormComponent } from './add-uguser-form.component';
import { DateSingleModule } from '../../../main/date/date-single/date-single.module';
import { SelectTreeModule } from '../../../main/select/select-tree/select-tree.module';
import { AddUgUserFormService } from './add-uguser-form.service';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        AddUgUserFormComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        DateSingleModule,
        SelectTreeModule,
        NgZorroAntdModule
    ],
    providers: [AddUgUserFormService],
    exports: [AddUgUserFormComponent]
})
export class AddUgUserFormModule { }
