import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserAuthFormComponent } from './add-user-auth-form.component';
import { DateSingleModule } from '../../../../../main/date/date-single/date-single.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
@NgModule({
    declarations: [
        AddUserAuthFormComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        DateSingleModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [AddUserAuthFormComponent]
})
export class AddUserAuthFormModule {

}
