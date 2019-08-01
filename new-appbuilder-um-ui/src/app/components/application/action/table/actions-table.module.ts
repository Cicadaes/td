import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { ActionsTableComponent } from './actions-table.component';
import { ActionsTableService } from './actions-table.service';
import { AddActionDialogModule } from '../dialog/add-action-dialog.module';

@NgModule({
    declarations: [
        ActionsTableComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        AddActionDialogModule,
        NgZorroAntdModule
    ],
    providers: [ActionsTableService],
    exports: [ActionsTableComponent]
})
export class ActionsTableModule {

}
