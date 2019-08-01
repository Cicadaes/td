import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitUploadFilesComponent } from './submit-upload-files.component';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        SubmitUploadFilesComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [SubmitUploadFilesComponent]
})
export class SubmitUploadFilesModule {

}
