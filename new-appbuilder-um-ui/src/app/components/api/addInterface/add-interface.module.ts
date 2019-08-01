import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { AddInterfaceComponent } from './add-interface.component';
import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

const routes: Routes = [
    {
        path: '',
        component: AddInterfaceComponent
    }

];

@NgModule({
    declarations: [
        AddInterfaceComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule,
        RouterModule.forChild(routes),
    ],
    providers: [ApiService],
    exports: [ AddInterfaceComponent ]
})
export class AddInterfaceModule { }
