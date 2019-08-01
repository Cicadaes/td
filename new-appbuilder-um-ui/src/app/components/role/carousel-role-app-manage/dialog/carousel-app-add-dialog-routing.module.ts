import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarouselAppAddDialogComponent } from './carousel-app-add-dialog.component';

const routes: Routes = [
    {
        path: '',
        component: CarouselAppAddDialogComponent
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

export class CarouselAppAddDialogRoutingModule { }