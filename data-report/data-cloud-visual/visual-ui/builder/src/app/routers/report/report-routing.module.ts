import {NgModule} from '@angular/core';
import {SmartReportComponent} from '../../report.component';
import {DatareportMlistComponent} from './../../smart-reports/support/report-mlist/report-mlist.component';
import {DatareportAlistComponent} from './../../smart-reports/support/report-alist/report-alist.component';
import {DatareportDlistComponent} from './../../smart-reports/support/report-dlist/report-dlist.component';
import {DatareportTlistComponent} from './../../smart-reports/support/report-tlist/report-tlist.component';
import {SmartIndexComponent} from './../../smart-indexs/index.component';
import {PreviewIndexComponent} from './../../smart-preview/preview.component';

import {
    RouterModule, Routes
} from '@angular/router';


const routes: Routes = [
    {
        path: '',
        component: SmartReportComponent,
        children: [
            {
                path: 'reportList',
                component: DatareportMlistComponent
            },
            {
                path: 'editReport/:reportID',
                component: SmartIndexComponent
            },
            {
                path: 'previewReport/:reportID',
                component: PreviewIndexComponent
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
export class SmartReportRoutingModule {

}
