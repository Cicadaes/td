import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPushManageComponent } from './app-push-manage.component';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ModalDialogModule } from '../../common/modal-dialog/modal-dialog.module';
import { RouterModule, Routes } from '@angular/router';
import { AppPushManageService } from './app-push-manage.service';
const appRoutes: Routes = [
    {
        path: '',
        component: AppPushManageComponent
    }
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        ModalDialogModule,
        RouterModule.forChild(appRoutes)
    ],
    declarations: [ AppPushManageComponent ],
    providers: [ AppPushManageService ]
})
export class AppPushManageModule { }
