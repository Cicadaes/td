import { CascaderModule } from './../../cascader/cascader.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectTreeComponent } from './select-tree.component';
import { SelectTreeService } from './select-tree.service';
import { NgZorroAntdModule } from 'ng-cosmos-ui';


@NgModule({
    declarations: [
        SelectTreeComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        CascaderModule,
        NgZorroAntdModule,
        // CosmosAllModule.forChild()
    ],
    providers: [SelectTreeService],
    exports: [SelectTreeComponent]
})
export class SelectTreeModule {

}
