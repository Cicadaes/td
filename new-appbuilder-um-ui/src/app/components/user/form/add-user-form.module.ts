import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddUserFormComponent } from './add-user-form.component';
import { DateSingleModule } from '../../../main/date/date-single/date-single.module';
import { SelectTreeModule } from '../../../main/select/select-tree/select-tree.module';
import { AddUserFormService } from './add-user-form.service';

@NgModule({
    declarations: [
        AddUserFormComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        DateSingleModule,
        SelectTreeModule,
        NgZorroAntdModule
    ],
    providers: [AddUserFormService],
    exports: [AddUserFormComponent]
})
export class AddUserFormModule {

}
