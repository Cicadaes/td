import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddActionDialogService } from './add-action-dialog.service';
import { AddActionDialogComponent } from './add-action-dialog.component';
import { CommonModule } from '@angular/common';
import {AddActionFormModule} from '../form/add-action-form.module';


@NgModule({
    declarations: [
        AddActionDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AddActionFormModule,
        NgZorroAntdModule
    ],
    providers: [AddActionDialogService],
    exports: [AddActionDialogComponent]
})
export class AddActionDialogModule {

}
