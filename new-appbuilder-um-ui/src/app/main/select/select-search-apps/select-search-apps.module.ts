import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import {SelectSearchAppsComponent} from './select-search-apps.component';
import { SelectSearchAppsService } from "./select-search-apps.service";

@NgModule({
    declarations: [
        SelectSearchAppsComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
    ],
    providers: [SelectSearchAppsService],
    exports: [SelectSearchAppsComponent]
})
export class SelectSearchAppsModule {

}