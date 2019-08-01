import {NgModule} from '@angular/core';
import {
    RouterModule, Routes
} from '@angular/router';

import {DatareportComponent} from '../../components/datareport/datareport.component';
import {DatareportAlistComponent} from '../../components/datareport/report-alist/report-alist.component';
import {DatareportTlistComponent} from '../../components/datareport/report-tlist/report-tlist.component';
import {DatareportPreviewBoxComponent} from '../../components/datareport/report-preview/report-preview.component';




const routes: Routes = [
    {
        path: '',
        component: DatareportComponent,
        children:[
            {
                path:'',
                redirectTo: 'reportAlist',
                pathMatch: 'full'
            },
            {
                path: 'reportAlist',
                component: DatareportAlistComponent
            },
            {
                path: 'reportTlist',
                component: DatareportTlistComponent
            },
            {
                path: 'previewReport/:reportID',
                component: DatareportPreviewBoxComponent
            }
        ]
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
export class DatareportRoutingModule {

}
