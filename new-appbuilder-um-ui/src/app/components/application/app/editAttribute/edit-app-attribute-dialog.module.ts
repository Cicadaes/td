import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { EditAppAttributeDialogService } from './edit-app-attribute-dialog.service';
import { EditAppAttributeDialogComponent } from './edit-app-attribute-dialog.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        EditAppAttributeDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgZorroAntdModule
    ],
    providers: [EditAppAttributeDialogService],
    exports: [EditAppAttributeDialogComponent]
})
export class EditAppAttributeDialogModule {

}
