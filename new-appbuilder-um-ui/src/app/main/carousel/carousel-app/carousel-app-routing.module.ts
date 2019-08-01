import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarouselAppComponent } from './carousel-app.component';

const routes: Routes = [
    {
        path: '',
        component: CarouselAppComponent
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

export class CarouselAppRoutingModule { }