import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { deptAuthDialogService } from './dept-auth-dialog.service';
import { AddActionDialogComponent } from './dept-auth-dialog.component';
import { CommonModule } from '@angular/common';
import { deptAuthFormModule } from '../form/dept-auth-form.module';
@NgModule({
    declarations: [
        AddActionDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        deptAuthFormModule,
        NgZorroAntdModule
    ],
    providers: [deptAuthDialogService],
    exports: [AddActionDialogComponent]
})
export class deptAuthDialogModule {

}
