import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessManageComponent } from './process-manage.component';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { MoreSearchModule } from '../../main/more-search/more-search.module';
import { ModalDialogModule } from '../../common/modal-dialog/modal-dialog.module';
import { RouterModule, Routes } from '@angular/router';
import { ProcessManageService } from './process-manage.service';
import { RejectDialogComponent } from './reject-dialog/reject-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const appRoutes: Routes = [
    {
        path: '',
        component: ProcessManageComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        NgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule,
        MoreSearchModule,
        ModalDialogModule,
        RouterModule.forChild(appRoutes)
    ],
    declarations: [ProcessManageComponent, RejectDialogComponent],
    providers: [
        ProcessManageService
    ]
})
export class ProcessManageModule { }
