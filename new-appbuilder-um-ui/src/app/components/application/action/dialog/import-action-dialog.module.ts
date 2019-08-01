import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { ImportActionDialogService } from './import-action-dialog.service';
import { ImportActionDialogComponent } from './import-action-dialog.component';
import { CommonModule } from '@angular/common';
import { SubmitUploadFilesModule } from '../../../../main/upload/submit-upload-files/submit-upload-files.module';


@NgModule({
    declarations: [
        ImportActionDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SubmitUploadFilesModule,
        NgZorroAntdModule
    ],
    providers: [ImportActionDialogService],
    exports: [ImportActionDialogComponent]
})
export class ImportActionDialogModule {

}
