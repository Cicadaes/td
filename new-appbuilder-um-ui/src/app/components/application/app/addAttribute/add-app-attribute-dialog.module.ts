import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddAppAttributeDialogService } from './add-app-attribute-dialog.service';
import { AddAppAttributeDialogComponent } from './add-app-attribute-dialog.component';
import { CommonModule } from '@angular/common';
import { AddAppFormModule } from '../form/add-app-form.module';

@NgModule({
    declarations: [
        AddAppAttributeDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AddAppFormModule,
        NgZorroAntdModule
    ],
    providers: [AddAppAttributeDialogService],
    exports: [AddAppAttributeDialogComponent]
})
export class AddAppAttributeDialogModule {

}
