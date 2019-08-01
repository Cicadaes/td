import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddUserDialogService } from './add-user-dialog.service';
import { AddUserDialogComponent } from './add-user-dialog.component';
import { CommonModule } from '@angular/common';
import { AddUserFormModule } from '../form/add-user-form.module';

@NgModule({
    declarations: [
        AddUserDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AddUserFormModule,
        NgZorroAntdModule
    ],
    providers: [AddUserDialogService],
    exports: [AddUserDialogComponent]
})
export class AddUserDialogModule {

}
