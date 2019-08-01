import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddOrgUserDialogService } from './add-orguser-dialog.service';
import { AddOrgUserDialogComponent } from './add-orguser-dialog.component';
import { CommonModule } from '@angular/common';
import { AddUgUserFormModule } from '../../../uguser/form/add-uguser-form.module';

@NgModule({
    declarations: [
        AddOrgUserDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        AddUgUserFormModule,
    ],
    providers: [AddOrgUserDialogService],
    exports: [AddOrgUserDialogComponent]
})
export class AddOrgUserDialogModule {

}
