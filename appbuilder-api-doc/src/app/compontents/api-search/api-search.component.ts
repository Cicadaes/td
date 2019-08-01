import { Component, OnInit } from '@angular/core';
import { ApiSearchService } from './api-search.service';
import { NzNotificationService } from 'ng-cosmos-ui';
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
    selector: 'app-api-search',
    templateUrl: './api-search.component.html',
    styleUrls: ['./api-search.component.css']
})
export class ApiSearchComponent implements OnInit {
    pageIndex = 1;
    pageSize = 10;
    loading = true;
    queryParams: any;
    catalogId: any;
    interfaceData = [];
    total: any = 1;
    value: any;                // 传递到top组件里
    constructor(
        private service: ApiSearchService,
        private notification: NzNotificationService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
            this.value = params.get('keyword');
            this.queryParams = {'keyword' : this.value};
            this.refreshData(true);
        });
    }

    // 查询接口列表
    refreshData(reset = false) {
        if (reset) {
            this.pageIndex = 1;
        }
        this.loading = true;
        const params = this.queryParams || {};
        params.page = this.pageIndex;
        params.pageSize = this.pageSize;
        params.status = 1;
        this.service.getInterfaceList(params).subscribe((response: any) => {
            if (response.code === 200) {
                this.loading = false;
                this.interfaceData = response.data.data;
                this.total = response.data.total;
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    // 查看API接口详情
    detail(item: any) {
        console.log(location.host);
        window.open(`http://${location.host}/apidoc/#/api-doc?apiId=${item.id}&catalogId=${item.catalogId}`);
        // this.router.navigate(['/api-doc', {'id': 393}]);
    }

}
