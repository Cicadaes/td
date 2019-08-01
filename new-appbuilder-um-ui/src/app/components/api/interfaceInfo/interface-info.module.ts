import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { Routes, RouterModule } from '@angular/router';
import { InterfaceInfoComponent } from './interface-info.component';
import { EditInterfaceComponent } from './editInterface/edit-interface.component';
import { SeeInterfaceComponent } from './seeInterface/see-interface.component';
import { OneMapModule } from '../one-map/one-map.module';
import { ResponseCodeService } from '../../responseCode/response-code.service';
import { DateFormatPipeModule } from '../../../pipes/dateFormat-pipe';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddAutoCodeModule } from '../addAutoCode/add-auto-code.module';

const routes: Routes = [
    {
        path: '',
        component: InterfaceInfoComponent
    }

];

@NgModule({
    declarations: [
        InterfaceInfoComponent,
        EditInterfaceComponent,
        SeeInterfaceComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        OneMapModule,
        AddAutoCodeModule,
        DateFormatPipeModule,
        NgZorroAntdModule,
        RouterModule.forChild(routes),
    ],
    providers: [ ApiService, ResponseCodeService],
    exports: [InterfaceInfoComponent]
})
export class InterfaceInfoModule { }
