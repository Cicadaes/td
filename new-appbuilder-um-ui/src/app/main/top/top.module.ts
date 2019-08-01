import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { TopService } from './top.service';
import { TopComponent } from './top.component';
import {BreadcrumbModule} from "../breadcrumb/breadcrumb.module";

@NgModule({
    declarations: [
        TopComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        BreadcrumbModule,
        NgZorroAntdModule
    ],
    providers: [TopService],
    exports: [TopComponent]
})
export class TopModule {

}