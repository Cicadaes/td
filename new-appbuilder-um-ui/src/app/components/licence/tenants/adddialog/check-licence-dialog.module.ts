import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { CheckLicenceDialogComponent} from './check-licence-dialog.component';
import {CheckLicenceDialogService} from './check-licence-dialog.service';

@NgModule({
    declarations: [
        CheckLicenceDialogComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
    ],
    providers: [CheckLicenceDialogService],
    exports: [CheckLicenceDialogComponent]
})
export class CheckLicenceDialogModule {

}