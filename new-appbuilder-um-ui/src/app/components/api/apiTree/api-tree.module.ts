import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiTreeService } from './api-tree.service';
import { ApiTreeRoutingModule } from './api-tree-routing.module';
import { NgZorroAntdModule, NzTreeModule } from 'ng-cosmos-ui';
import { ApiTreeComponent } from './api-tree.component';

@NgModule({
    declarations: [
        ApiTreeComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        ApiTreeRoutingModule,
        NzTreeModule,
        NgZorroAntdModule

    ],
    providers: [ ApiTreeService ],
    exports: [ ApiTreeComponent ]
})
export class ApiTreeModule { }
