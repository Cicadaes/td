import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddPermissionsFormComponent } from './add-permissions-form.component';

@NgModule({
    declarations: [
        AddPermissionsFormComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [AddPermissionsFormComponent]
})
export class AddPermissionsFormModule {

}