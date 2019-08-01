import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { CommonModule } from '@angular/common';
import { MoreSearchModule } from '../../main/more-search/more-search.module';
import { ApiRoutingModule } from './api.routing.module';
import { ApiService } from './api.service';
import { ApiComponent } from './api.component';
import { ApiTreeModule } from './apiTree/api-tree.module';
import { InterfaceListComponent } from './interfaceList/interface-list.compontent';
import { VersionListComponent } from './versionList/version-list.compontent';
import { AddVersionComponent } from './addVersion/add-version.component';
import { AddProductComponent } from './addProduct/add-product.component';
import { AddInterfaceModule } from './addInterface/add-interface.module';
import { InterfaceInfoModule } from './interfaceInfo/interface-info.module';
import { SetValueLengthPipeModule } from '../../pipes/setStringLength-pipe';
import { DateFormatPipeModule } from '../../pipes/dateFormat-pipe';

@NgModule({
    declarations: [
        ApiComponent,
        InterfaceListComponent,
        VersionListComponent,
        AddProductComponent,
        AddVersionComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        ApiRoutingModule,
        ApiTreeModule,
        MoreSearchModule,
        AddInterfaceModule,
        InterfaceInfoModule,
        SetValueLengthPipeModule,
        DateFormatPipeModule,
    ],
    providers: [ApiService],
    exports: [ApiComponent]
})
export class ApiModule { }
