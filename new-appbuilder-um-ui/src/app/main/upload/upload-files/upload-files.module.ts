import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { UploadFilesComponent } from './upload-files.component';

@NgModule({
    declarations: [
        UploadFilesComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [UploadFilesComponent]
})
export class UploadFilesModule {

}
