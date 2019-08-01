import { manageRoleRoutingModule } from './manage-role-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { manageRoleService } from './manage-role.service';
import { manageRoleComponent } from './manage-role.component';
import {CommonModule} from '@angular/common';
import { MoreSearchModule } from '../../../../main/more-search/more-search.module';

@NgModule({
    declarations: [
        manageRoleComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        manageRoleRoutingModule,
        MoreSearchModule,
        NgZorroAntdModule
    ],
    providers: [manageRoleService],
    exports: [manageRoleComponent]
})
export class manageRoleModule {

}
