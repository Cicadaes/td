import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { EditLicencePageComponent} from './edit-licence-page.component';
import {EditLicencePageService} from './edit-licence-page.service';

@NgModule({
    declarations: [
        EditLicencePageComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
        ],
    providers: [EditLicencePageService],
    exports: [EditLicencePageComponent]
})
export class EditLicencePageModule {

}