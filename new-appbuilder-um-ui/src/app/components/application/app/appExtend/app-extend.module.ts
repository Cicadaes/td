import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AppExtendComponent } from './app-extend.component';
import { AppExtendService } from './app-extend.service';
import { AddAppDialogModule } from '../dialog/add-app-dialog.module';
import { AppExtendRoutingModule } from './app-extend-routing.module';
import { AddAppExtendDialogModule } from '../addExtend/add-app-extend-dialog.module';
import { EditAppExtendDialogModule } from '../editExtend/edit-app-extend-dialog.module';

@NgModule({
    declarations: [
        AppExtendComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        AddAppDialogModule,
        AddAppExtendDialogModule,
        EditAppExtendDialogModule,
        AppExtendRoutingModule,
        NgZorroAntdModule
    ],
    providers: [AppExtendService],
    exports: [AppExtendComponent]
})
export class AppExtendModule {

}
