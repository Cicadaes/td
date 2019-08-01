import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { deptAuthTreeService } from './dept-auth-tree.service';
import { deptAuthTreeComponent } from './dept-auth-tree.component';
import { deptAuthTreeRoutingModule } from './dept-auth-tree-routing.module';
import { NzTreeModule, NgZorroAntdModule } from 'ng-cosmos-ui';
import { deptAuthPageModule } from '../page/dept-auth-page.module';


@NgModule({
    declarations: [
        deptAuthTreeComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        deptAuthTreeRoutingModule,
        NzTreeModule,
        deptAuthPageModule,
        NgZorroAntdModule.forRoot()

    ],
    providers: [deptAuthTreeService],
    exports: [deptAuthTreeComponent]
})
export class deptAuthTreeModule {

}
