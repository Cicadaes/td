import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DetailFuncDialogService } from './detail-func-dialog.service';
import { DetailFuncDialogComponent } from './detail-func-dialog.component';
import { CommonModule } from '@angular/common';
import { CheckboxTreeModule } from '../../../../../main/checkbox/checkbox-tree/checkbox-tree.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
@NgModule({
    declarations: [
        DetailFuncDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CheckboxTreeModule,
        NgZorroAntdModule
    ],
    providers: [DetailFuncDialogService],
    exports: [DetailFuncDialogComponent]
})
export class DetailFuncDialogModule {

}
