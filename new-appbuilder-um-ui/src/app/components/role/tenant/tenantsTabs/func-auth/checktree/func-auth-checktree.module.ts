import { NgModule } from '@angular/core';
import { FuncAuthCheckTreeComponent } from './func-auth-checktree.component';
import { FuncAuthCheckTreeService } from './func-auth-checktree.service';
import { CheckboxTreeModule } from '../../../../../../main/checkbox/checkbox-tree/checkbox-tree.module';

@NgModule({
    declarations: [
        FuncAuthCheckTreeComponent
    ],
    imports: [
        CheckboxTreeModule,
    ],
    providers: [FuncAuthCheckTreeService],
    exports: [FuncAuthCheckTreeComponent]
})
export class FuncAuthCheckTreeModule {

}
