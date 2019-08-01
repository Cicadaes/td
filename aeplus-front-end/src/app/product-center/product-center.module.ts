import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {ProductCenterRoutingModule} from './product-center.routing';
import {ProductCenterComponent} from './product-center.component';
import {ProductCenterTableComponent} from './table/product-center-table/product-center-table.component';
import {ProductAddDialogComponent} from './dialog/product-add-dialog/product-add-dialog.component';
import {ProductAddFormComponent} from './form/product-add-form/product-add-form.component';
import {PlatformPipeModule} from '../../pipes/platform-pipe';
import {FastSearchModule} from '../main/fast-search/fast-search.module';
import {ModalDialogModule} from '../common/modal-dialog/modal-dialog.module';
import {NumberToThousandsPipeModule} from '../../pipes/number-to-thousands-pipe';
import { ProductShareDialogComponent } from './dialog/product-share-dialog/product-share-dialog.component';
import {CommonStatusPipeModule} from '../../pipes/common-status-pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ProductCenterRoutingModule,
        NgZorroAntdModule,
        PlatformPipeModule,
        FastSearchModule,
        ModalDialogModule,
        NumberToThousandsPipeModule,
        CommonStatusPipeModule
    ],
    declarations: [
        ProductCenterComponent,
        ProductCenterTableComponent,
        ProductAddDialogComponent,
        ProductAddFormComponent,
        ProductShareDialogComponent
    ]
})
export class ProductCenterModule {
}

