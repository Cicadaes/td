import {RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { MenuService } from './menu.service';
import { MenuComponent } from './menu.component';

@NgModule({
    declarations: [
        MenuComponent
    ],
    imports: [
        RouterModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule

    ],
    providers: [MenuService],
    exports: [MenuComponent]
})
export class MenuModule {

}
