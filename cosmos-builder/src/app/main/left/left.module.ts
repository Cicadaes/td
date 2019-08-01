import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeftService } from './left.service';
import { LeftComponent } from './left.component';
import { MenuModule } from 'ng-cosmos-td-ui/src/base/menu/menu.module';

@NgModule({

    declarations: [
        LeftComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MenuModule
    ],
    providers:[LeftService],
    exports: [LeftComponent]
})
export class LeftModule {
       
}