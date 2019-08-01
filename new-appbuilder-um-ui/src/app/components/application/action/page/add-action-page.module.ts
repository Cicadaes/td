import { AddActionPageRoutingModule } from './add-action-page-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddActionPageComponent } from './add-action-page.component';
import { AddActionPageService } from './add-action-page.service';
import { AddActionFormModule } from '../form/add-action-form.module';


@NgModule({
    declarations: [
        AddActionPageComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        AddActionPageRoutingModule,
        AddActionFormModule,
        NgZorroAntdModule
    ],
    providers: [AddActionPageService],
    exports: [AddActionPageComponent]
})
export class AddActionPageModule {

}
