import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddUgUserDialogService } from './add-uguser-dialog.service';
import { AddUgUserDialogComponent } from './add-uguser-dialog.component';
import { CommonModule } from '@angular/common';
import { AddUgUserFormModule } from '../form/add-uguser-form.module';

@NgModule({
    declarations: [
        AddUgUserDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AddUgUserFormModule,
        NgZorroAntdModule
    ],
    providers: [AddUgUserDialogService],
    exports: [AddUgUserDialogComponent]
})
export class AddUgUserDialogModule {

}
