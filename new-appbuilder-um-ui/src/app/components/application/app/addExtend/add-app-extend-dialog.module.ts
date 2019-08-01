import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import {AddAppExtendDialogService} from './add-app-extend-dialog.service';
import { AddAppExtendDialogComponent } from './add-app-extend-dialog.component';
import { CommonModule } from '@angular/common';
import {AddAppFormModule} from '../form/add-app-form.module';

@NgModule({
    declarations: [
        AddAppExtendDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AddAppFormModule,
        NgZorroAntdModule
    ],
    providers: [AddAppExtendDialogService],
    exports: [AddAppExtendDialogComponent]
})
export class AddAppExtendDialogModule {

}
