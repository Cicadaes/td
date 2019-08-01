import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddUserGroupAuthFormComponent } from './add-user-group-auth-form.component';
import { DateSingleModule } from '../../../../../main/date/date-single/date-single.module';

@NgModule({
    declarations: [
        AddUserGroupAuthFormComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        DateSingleModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [AddUserGroupAuthFormComponent]
})
export class AddUserGroupAuthFormModule {

}