import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddTenantFormComponent } from './add-tenant-form.component';
import { DateSingleModule } from '../../../main/date/date-single/date-single.module';
import { AddTenantFormService } from './add-tenant-form.service';

@NgModule({
    declarations: [
        AddTenantFormComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        DateSingleModule,
        NgZorroAntdModule
        ],
    providers: [AddTenantFormService],
    exports: [AddTenantFormComponent]
})
export class AddTenantFormModule {

}
