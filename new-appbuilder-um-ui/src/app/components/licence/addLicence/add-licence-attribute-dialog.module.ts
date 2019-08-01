import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import {AddLicenceAttributeDialogService} from './add-licence-attribute-dialog.service';
import { AddLicenceAttributeDialogComponent } from './add-licence-attribute-dialog.component';
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
        AddLicenceAttributeDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgZorroAntdModule
    ],
    providers: [AddLicenceAttributeDialogService],
    exports: [AddLicenceAttributeDialogComponent]
})
export class AddLicenceAttributeDialogModule {

}