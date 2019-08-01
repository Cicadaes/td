import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import {AddTenantsLicenceFormComponent} from './add-tenants-licence-form.component';
import {SelectSearchModule} from "../../../../main/select/select-search/select-search.module";
import {DateRangeModule} from "../../../../main/date/date-range/date-range.module";

@NgModule({
    declarations: [
        AddTenantsLicenceFormComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        SelectSearchModule,
        DateRangeModule,
        NgZorroAntdModule
        ],
    providers: [],
    exports: [AddTenantsLicenceFormComponent]
})
export class AddTenantsLicenceFormModule {

}