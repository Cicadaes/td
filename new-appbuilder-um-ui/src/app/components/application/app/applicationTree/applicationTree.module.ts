import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { applicationTreeService } from './applicationTree.service';
import { applicationTreeComponent } from './applicationTree.component';
import { applicationTreeRoutingModule } from './applicationTree-routing.module';
import { NzTreeModule, NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddActionPageModule } from '../../action/page/add-action-page.module';



@NgModule({
    declarations: [
        applicationTreeComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        applicationTreeRoutingModule,
        NzTreeModule,
        AddActionPageModule,
        NgZorroAntdModule.forRoot()

    ],
    providers: [applicationTreeService],
    exports: [applicationTreeComponent]
})
export class applicationTreeModule {

}
