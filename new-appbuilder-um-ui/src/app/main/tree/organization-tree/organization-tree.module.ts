import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { OrganizationTreeService } from './organization-tree.service';
import { OrganizationTreeComponent } from './organization-tree.component';
import { ComMenuTreeModule } from '../cmMenuTree/cmMenuTree.module';

@NgModule({
    declarations: [
        OrganizationTreeComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        NgZorroAntdModule,
        ComMenuTreeModule
    ],
    providers: [OrganizationTreeService],
    exports: [OrganizationTreeComponent]
})
export class OrganizationTreeModule {

}
