import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { EditAppExtendDialogService } from './edit-app-extend-dialog.service';
import { EditAppExtendDialogComponent } from './edit-app-extend-dialog.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        EditAppExtendDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgZorroAntdModule
    ],
    providers: [EditAppExtendDialogService],
    exports: [EditAppExtendDialogComponent]
})
export class EditAppExtendDialogModule {

}
