import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { FuncAuthCheckTreeComponent } from './func-auth-checktree.component';
import { FuncAuthCheckTreeService } from "./func-auth-checktree.service";
import { CheckboxTreeModule } from '../../../../../../../main/checkbox/checkbox-tree/checkbox-tree.module';

@NgModule({
    declarations: [
        FuncAuthCheckTreeComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        CheckboxTreeModule,
        NgZorroAntdModule
    ],
    providers: [FuncAuthCheckTreeService],
    exports: [FuncAuthCheckTreeComponent]
})
export class FuncAuthCheckTreeModule {

}