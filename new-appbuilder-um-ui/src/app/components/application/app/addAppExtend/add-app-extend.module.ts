import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddAppExtendCompontent } from './add-app-extend.component';
import { AddAppExtendService } from './add-app-extend.service';
import { AddAppDialogModule } from '../dialog/add-app-dialog.module';
import { AddAppExtendRoutingModule } from './add-app-extend-routing.module';
import { AddAppExtendDialogModule } from '../addExtend/add-app-extend-dialog.module';

@NgModule({
    declarations: [
        AddAppExtendCompontent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        AddAppDialogModule,
        AddAppExtendDialogModule,
        AddAppExtendRoutingModule,
        NgZorroAntdModule
    ],
    providers: [AddAppExtendService],
    exports: [AddAppExtendCompontent]
})
export class AddAppExtendModule {

}
