import {NgModule} from '@angular/core';
import {
    RouterModule, Routes
} from '@angular/router';
import {ProductCenterComponent} from './product-center.component';


const appRoutes: Routes = [
    {
        path: '',
        component: ProductCenterComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ProductCenterRoutingModule {

}
