import {NgModule} from '@angular/core';

import { SmartComponent } from './../../smart-reports/smart.component';
import {
    RouterModule, Routes
} from '@angular/router';



const routes: Routes = [
    {
        path: '',
        component: SmartComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class SmartRoutingModule {

}
