import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CheckboxTreeService } from './checkbox-tree.service';
import { CheckboxTreeComponent } from './checkbox-tree.component';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
// 待处理树
@NgModule({
    declarations: [
        CheckboxTreeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule
    ],
    providers: [CheckboxTreeService],
    exports: [CheckboxTreeComponent]
})
export class CheckboxTreeModule {

}
