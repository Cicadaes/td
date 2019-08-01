import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { EventConfigComponent } from './../../components/config/event-config/event-config.component';

const routes: Routes = [
    {
        path: '',
        component: EventConfigComponent
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class EventConfigRoutingModule {}