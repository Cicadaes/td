import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import {EditLicenceAttributeDialogService} from './edit-licence-attribute-dialog.service';
import {EditLicenceAttributeDialogComponent} from './edit-licence-attribute-dialog.component';
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
        EditLicenceAttributeDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgZorroAntdModule
    ],
    providers: [EditLicenceAttributeDialogService],
    exports: [EditLicenceAttributeDialogComponent]
})
export class EditLicenceAttributeDialogModule {

}