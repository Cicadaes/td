import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddAppDialogService } from './add-app-dialog.service';
import { AddAppDialogComponent } from './add-app-dialog.component';
import { CommonModule } from '@angular/common';
import { AddAppFormModule } from '../form/add-app-form.module';

@NgModule({
    declarations: [
        AddAppDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AddAppFormModule,
        NgZorroAntdModule
    ],
    providers: [AddAppDialogService],
    exports: [AddAppDialogComponent]
})
export class AddAppDialogModule {

}
