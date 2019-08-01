import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddRoleFormComponent } from './add-role-form.component';

@NgModule({
    declarations: [
        AddRoleFormComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
       
    ],
    providers: [],
    exports: [AddRoleFormComponent]
})
export class AddRoleFormModule {

}