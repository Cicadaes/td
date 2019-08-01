import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import {TlicencesAttributeTableComponent} from './tlicences-attribute-table.component';
import {TlicencesAttributeTableService} from "./tlicences-attribute-table.service";
import {TlicencesAttributeTableRoutingModule} from "./tlicences-attribute-table-routing.module";

@NgModule({
    declarations: [
        TlicencesAttributeTableComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        TlicencesAttributeTableRoutingModule,
        NgZorroAntdModule
    ],
    providers: [TlicencesAttributeTableService],
    exports: [TlicencesAttributeTableComponent]
})
export class TlicencesAttributeTableModule {

}