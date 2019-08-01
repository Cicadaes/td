import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantsAppsComponent} from './tenants-apps.component';


const routes: Routes = [
    {
        path: '',
        component: TenantsAppsComponent
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

export class TenantsAppsRoutingModule { }
