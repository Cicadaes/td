import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeptAuthTableComponent } from './dept-auth-table.component';
import { DeptAuthTableService } from './dept-auth-table.service';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
@NgModule({
    declarations: [
        DeptAuthTableComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
    ],
    providers: [DeptAuthTableService],
    exports: [DeptAuthTableComponent]
})
export class DeptAuthTableModule {

}
