import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TabListComponent} from './tab-list.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgZorroAntdModule,
    ],
    declarations: [TabListComponent],
    exports: [TabListComponent]
})
export class TabListModule {
}
