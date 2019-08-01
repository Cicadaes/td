import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { Routes, RouterModule } from '@angular/router';
import { OneMapComponent } from './one-map.component';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

const routes: Routes = [
    {
        path: '',
        component: OneMapComponent
    }

];

@NgModule({
    declarations: [
        OneMapComponent
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule,
        RouterModule.forChild(routes),
    ],
    providers: [ApiService],
    exports: [OneMapComponent]
})
export class OneMapModule { }
