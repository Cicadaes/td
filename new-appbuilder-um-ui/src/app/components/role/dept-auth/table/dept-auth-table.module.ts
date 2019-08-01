import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { DeptAuthTableComponent } from './dept-auth-table.component';
import { DeptAuthTableService } from './dept-auth-table.service';
// import {AddDeptAuthDialogModule} from '../dialog/add-func-auth-dialog.module';

@NgModule({
    declarations: [
        DeptAuthTableComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
        // AddDeptAuthDialogModule,

    ],
    providers: [DeptAuthTableService],
    exports: [DeptAuthTableComponent]
})
export class DeptAuthTableModule {

}
