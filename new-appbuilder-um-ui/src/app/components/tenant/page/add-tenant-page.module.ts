import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AddTenantPageService } from './add-tenant-page.service';
import { AddTenantPageComponent } from './add-tenant-page.component';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

import { AddTenantFormModule} from '../form/add-tenant-form.module';
import { AddTenantPageRoutingModule } from './add-tenant-page-routing.module';

@NgModule({
    declarations: [
        AddTenantPageComponent
    ],
    imports: [
        AddTenantPageRoutingModule,
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        AddTenantFormModule,
    ],
    providers: [AddTenantPageService],
    exports: [AddTenantPageComponent]
})
export class AddTenantPageModule { }
