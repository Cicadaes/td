import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { deptAuthFormComponent } from './dept-auth-form.component';
import { deptAuthFormService } from './dept-auth-form.service';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
@NgModule({
    declarations: [
        deptAuthFormComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
    ],
    providers: [deptAuthFormService],
    exports: [deptAuthFormComponent]
})
export class deptAuthFormModule {

}
