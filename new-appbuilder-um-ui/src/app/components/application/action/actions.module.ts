import { ActionsRoutingModule } from './actions-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { ActionsService } from './actions.service';
import { ActionsComponent } from './actions.component';
import {CommonModule} from "@angular/common";
import {MoreSearchModule} from "../../../main/more-search/more-search.module";
import {AddActionDialogModule} from "./dialog/add-action-dialog.module";
import {ActionsTableModule} from "./table/actions-table.module";


@NgModule({
    declarations: [
        ActionsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ActionsRoutingModule,
        MoreSearchModule,
        AddActionDialogModule,
        ActionsTableModule,
        NgZorroAntdModule
    ],
    providers: [ActionsService],
    exports: [ActionsComponent]
})
export class ActionsModule {

}