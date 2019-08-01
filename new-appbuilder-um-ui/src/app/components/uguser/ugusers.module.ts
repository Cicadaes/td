import { UgUsersRoutingModule } from './ugusers-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { UgUsersService } from './ugusers.service';
import { UgUsersComponent } from './ugusers.component';
import {CommonModule} from "@angular/common";
import {MoreSearchModule} from "../../main/more-search/more-search.module";
import {AddUgUserDialogModule} from "./dialog/add-uguser-dialog.module";
import {UgUsersTableModule} from "./table/ugusers-table.module";

@NgModule({
    declarations: [
        UgUsersComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        UgUsersRoutingModule,
        MoreSearchModule,
        UgUsersTableModule,
        AddUgUserDialogModule,
        NgZorroAntdModule
    ],
    providers: [UgUsersService],
    exports: [UgUsersComponent]
})
export class UgUsersModule {

}