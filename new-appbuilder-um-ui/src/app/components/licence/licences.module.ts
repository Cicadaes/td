import { LicencesRoutingModule } from './licences-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { LicencesService } from './licences.service';
import { LicencesComponent } from './licences.component';
import {CommonModule} from "@angular/common";
import {MoreSearchModule} from "../../main/more-search/more-search.module";
import {LicencesTableModule} from "./table/licences-table.module";

@NgModule({
    declarations: [
        LicencesComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MoreSearchModule,
        LicencesRoutingModule,
        LicencesTableModule,
        NgZorroAntdModule
    ],
    providers: [LicencesService],
    exports: [LicencesComponent]
})
export class LicencesModule {

}