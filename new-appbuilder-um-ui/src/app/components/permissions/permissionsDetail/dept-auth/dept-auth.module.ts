import { DeptAuthRoutingModule } from './dept-auth-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DeptAuthService } from './dept-auth.service';
import { DeptAuthComponent } from './dept-auth.component';
import { CommonModule } from '@angular/common';
import { DeptAuthTableModule } from './table/dept-auth-table.module';
import { deptAuthDialogModule } from './dialog/dept-auth-dialog.module';
import { deptAuthTreeModule } from './tree/dept-auth-tree.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
@NgModule({
    declarations: [
        DeptAuthComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DeptAuthRoutingModule,
        DeptAuthTableModule,
        deptAuthDialogModule,
        deptAuthTreeModule,
        NgZorroAntdModule
    ],
    providers: [DeptAuthService],
    exports: [DeptAuthComponent]
})
export class DeptAuthModule {

}
