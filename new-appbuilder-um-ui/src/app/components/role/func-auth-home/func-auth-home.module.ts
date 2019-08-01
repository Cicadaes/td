import { FuncAuthHomeRoutingModule } from './func-auth-home-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { FuncAuthHomeComponent } from './func-auth-home.component';
import { CommonModule } from '@angular/common';
import { FuncAuthModule } from './func-auth/func-auth.module';
import { FuncAuthHomeService } from './func-auth-home.service';
import { DataObjectAuthComponent } from './data-object-auth/data-object-auth.component';
import { DetailAuthComponent } from './detail-auth/detail-auth.component';
import { MoreSearchModule } from '../../../main/more-search/more-search.module';
import { AddDataDialogComponent } from './add-data-dialog/add-data-dialog.component';
import { EditDataDialogComponent } from './edit-data-dialog/edit-data-dialog.component';

// 待处理树
@NgModule({
    declarations: [
        FuncAuthHomeComponent,
        DataObjectAuthComponent,
        DetailAuthComponent,
        AddDataDialogComponent,
        EditDataDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FuncAuthModule,
        MoreSearchModule,
        FuncAuthHomeRoutingModule,
        NgZorroAntdModule

    ],
    providers: [FuncAuthHomeService],
    exports: [FuncAuthHomeComponent]
})
export class FuncAuthHomeModule {

}
