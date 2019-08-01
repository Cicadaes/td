import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import {AddActionAttributeDialogService} from './add-action-attribute-dialog.service';
import { AddActionAttributeDialogComponent } from './add-action-attribute-dialog.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        AddActionAttributeDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule
    ],
    providers: [AddActionAttributeDialogService],
    exports: [AddActionAttributeDialogComponent]
})
export class AddActionAttributeDialogModule {

}
