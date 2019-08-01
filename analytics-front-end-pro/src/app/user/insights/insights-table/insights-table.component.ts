import {Input, Component, Injector, OnInit, OnChanges} from '@angular/core';
import {InsightsService} from '../insights.service';
import {BaseComponent} from '../../../common/base-component';

@Component({
    selector: 'app-insights-table',
    templateUrl: './insights-table.component.html',
    styleUrls: ['./insights-table.component.less']
})
export class InsightsTableComponent extends BaseComponent implements OnInit, OnChanges {

    tableTitle: any;   // 列表表头
    tableList: any;    // 列表数据
    page: number;      // 列表页数
    rows: number;      // 列表每页页数
    total: number;     // 列表总数
    laoding: boolean;

    scroll: any = {
        x: '840px'
    };

    // crowdId: number;  // 人群id

    @Input() crowdId: number;
    tableNoData: string;

    @Input() fromMktPipe: boolean; // 是否是从营销的算子跳进来的

    constructor(public insightsService: InsightsService,
                private injector: Injector) {
        super(injector);
        const that = this;
        that.page = 1;
        that.rows = 10;
        // that.crowdId = 22;   // TODO 暂时写死
        // that.productId = 3006328; // TODO 暂时写死
    }

    ngOnChanges() {
        const that = this;
        if (that.crowdId) {
            that.getList();
        }
    }

    ngOnInit() {
        const that = this;
        that.laoding = true;
        // TODO 暂时把productId写死为3006328
        that.insightsService.getTableListTitle().subscribe((data: any) => {
            if (data.code === 200) {
                that.tableTitle = data.data;
            }
            if (data.data.length < 1) {
                this.tableNoData = '暂未对用户列表进行配置，请在管理-用户配置-用户洞察配置中进行配置，如果没权限，请联系管理员。';
            } else {
                that.scroll.x = (data.data.length * 200) + 'px';
            }
        });
    }

    getList() {
        const that = this;
        that.laoding = true;
        that.insightsService.getTableList(that.crowdId, that.page, that.rows, that.productId).subscribe((data: any) => {
            that.laoding = false;
            if (data.code === 200) {
                that.tableList = data.data.rows;
                that.total = data.data.total;
            } else {
                that.total = 0;
            }
        });
    }

    goUserProfile(data: any) {
        const that = this;

        const params = {
            // crowdId: data.id,
            // accountId: data.accountid,
            // distinctId: data.distinctid,
            // accountType: data.accounttype,
            // accountOffset: data.accountoffset,
            // offset: data.offset,
        };
        if (data.id) {
            params['crowdId'] = data.id;
        }
        if (data.accountid) {
            params['accountId'] = data.accountid;
        }
        if (data.distinctid) {
            params['distinctId'] = data.distinctid;
        }
        if (data.accounttype) {
            params['accountType'] = data.accounttype;
        }
        if (data.accountoffset) {
            params['accountOffset'] = data.accountoffset;
        }
        if (data.offset) {
            params['offset'] = data.offset;
        }
        that.commonService.goInto({
            name: '用户档案',
            url: `/user/user-profile`,
            params: params
        });
    }
}
