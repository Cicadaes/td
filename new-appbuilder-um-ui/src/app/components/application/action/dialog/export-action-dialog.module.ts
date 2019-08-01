import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { ExportActionDialogService } from './export-action-dialog.service';
import { ExportActionDialogComponent } from './export-action-dialog.component';
import { CommonModule } from '@angular/common';
import { CheckboxTreeModule } from '../../../../main/checkbox/checkbox-tree/checkbox-tree.module';


@NgModule({
    declarations: [
        ExportActionDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CheckboxTreeModule,
        NgZorroAntdModule
    ],
    providers: [ExportActionDialogService],
    exports: [ExportActionDialogComponent]
})
export class ExportActionDialogModule {

}
