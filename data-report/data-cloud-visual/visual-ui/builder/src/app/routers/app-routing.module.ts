import { NgModule } from '@angular/core';
import {
    RouterModule, Routes
} from '@angular/router';

// console.log(process.env.DIST);

let appRoutes: Routes;
if(process.env.ENV === 'developer_report') {
    appRoutes =  [
        {
            path: '',
            redirectTo: process.env.DIST + 'datareport',
            pathMatch: 'full'
        },
        {
            path: process.env.DIST + 'datareport',
            loadChildren: '../modules/report/report.module#SmartReportModule'
        }
    ]
}else if(process.env.ENV == "test_report" || process.env.ENV == "production_report"){
    appRoutes =  [
        {
            path: '',
            redirectTo: process.env.DIST + '/datareport',
            pathMatch: 'prefix'
        },
        {
            path: process.env.DIST + '/datareport',
            loadChildren: '../modules/report/report.module#SmartReportModule'
        }
    ]
}



function errorHandler(e: any) {
    console.log(e)
    if(process.env.ENV === 'developer_report'){
        this.navigateByUrl('/datareport');
    }if(process.env.ENV === 'test_report' || process.env.ENV === 'production_report'){
        this.navigateByUrl('/'+ process.env.DIST + '/datareport');
    }
}

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, { errorHandler: errorHandler })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {

}
