import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarouselAppManageComponent } from './carousel-app-manage.component';

const routes: Routes = [
    {
        path: '',
        component: CarouselAppManageComponent
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

export class CarouselAppManageRoutingModule { }