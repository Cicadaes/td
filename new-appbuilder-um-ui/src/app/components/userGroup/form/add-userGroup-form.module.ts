import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserGroupFormComponent } from './add-userGroup-form.component';
import { DateSingleModule } from '../../../main/date/date-single/date-single.module';
import { SelectTreeModule } from '../../../main/select/select-tree/select-tree.module';
import { AddUserGroupFormService } from './add-userGroup-form.service';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        AddUserGroupFormComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        DateSingleModule,
        SelectTreeModule,
        NgZorroAntdModule
    ],
    providers: [ AddUserGroupFormService ],
    exports: [ AddUserGroupFormComponent ]
})
export class AddUserGroupFormModule { }
