/**
 * Created by wangshouyun on 2017/2/27.
 */
import {NgModule} from '@angular/core';
import {HeaderComponent} from '../components/header.component';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [
        HeaderComponent
    ],
    exports: [
        HeaderComponent
    ]
})
export class HeaderModule {

}
