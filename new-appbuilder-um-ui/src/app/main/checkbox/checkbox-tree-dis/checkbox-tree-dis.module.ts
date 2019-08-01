import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { CheckboxTreeDisComponent } from './checkbox-tree-dis.component';
import { CheckboxTreeService } from './checkbox-tree.service';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
      CheckboxTreeDisComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule
    ],
    providers: [CheckboxTreeService],
    exports: [CheckboxTreeDisComponent]
})
export class CheckboxTreeDisModule {

}
