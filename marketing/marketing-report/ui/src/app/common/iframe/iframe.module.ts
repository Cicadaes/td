/**
 * Created by wangshouyun on 2017/2/27.
 */
import {NgModule} from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {IFrameComponent} from "./iframe.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        IFrameComponent
    ],
    exports: [
        IFrameComponent
    ]
})
export class IFrameModule {

}
