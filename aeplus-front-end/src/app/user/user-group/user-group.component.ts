import {Component, Injector, ChangeDetectorRef, OnInit, OnChanges} from '@angular/core';
import {UserGroupService} from './user-group.service';
import {TABLE_PAGE_SIZE_OPTIONS} from '../../common/config/page.size.config';
import {getMessage} from '../../utils/post-message';
import {BaseComponent} from '../../common/base-component';

@Component({
    selector: 'app-user-group',
    templateUrl: './user-group.component.html',
    styleUrls: ['./user-group.component.less'],
    providers: [UserGroupService]
})
export class UserGroupComponent extends BaseComponent implements OnInit, OnChanges {
    isSubCrowd: boolean;  // 是否是子人群
    crowdId: number;     // 父人群id
    titleName: string;   // 列表标题
    showAdvancedSearch: boolean;
    tableList: any; // 列表数据
    laoding: boolean;   // 列表loading
    page: number;        // 列表当前页数 默认为1
    pageSize: number;   // 列表当前每页数量
    nzPageSizeOptions: number[];   // 列表页数选择器
    total: number;      // 列表数据总数量
    setTimeoutParam: any;

    crowdTypeMap: any;    // 人群类型字典
    calcStausMap: any;    // 计算状态字典
    statusMap: any;       // 状态字典

    crowdSourceList: any;  // 人群来源列表
    calcStatusList: any;  // 计算状态列表
    statusList: any;     // 状态列表

    advancedSearchParams: any; // 高级搜索参数
    createDate: any;   // 创建时间
    updateDate: any;   // 更新时间

    dateRange: any;

    createName: string;

    constructor(public userGroupService: UserGroupService,
                private injector: Injector,
                public changeDetectorRef: ChangeDetectorRef) {
        super(injector);
        this.initRouterList('用户分群');

        const that = this;

        // 获取url上参数
        that.isSubCrowd = that.route.snapshot.routeConfig.path === 'child';
        if (that.isSubCrowd) {
            that.crowdId = that.route.snapshot.params['id'];
            that.titleName = '子人群列表';
        } else {
            that.titleName = '人群列表';
        }

        // 初始化数据
        that.showAdvancedSearch = false;
        that.page = 1;
        that.pageSize = 10;
        that.nzPageSizeOptions = TABLE_PAGE_SIZE_OPTIONS;

        if (that.route.snapshot.params['page']) {
            that.page = that.route.snapshot.params['page'];
        }

        that.total = 0;
        that.laoding = true;
        that.crowdTypeMap = {};
        that.calcStausMap = {};
        that.statusMap = {};
        that.crowdSourceList = [{
            key: '',
            value: '全部'
        }];
        that.calcStatusList = [{
            key: '',
            value: '全部'
        }];
        that.statusList = [{
            key: '',
            value: '全部'
        }];
        that.advancedSearchParams = {};
        that.createDate = [];
        that.updateDate = [];

        getMessage('user-group', ['user'], 'user-group');
        window.addEventListener('message', function (event: any) {
            if (event.data && typeof event.data === 'string') {
                const data = JSON.parse(event.data);
                if (data && data.eventInfo && data.eventInfo.sourceType === 'user-group' && data.eventType === 'response') {
                    const user = data.eventInfo.data && data.eventInfo.data['user'] && JSON.parse(data.eventInfo.data['user']);
                    that.createName = user && user.userName.toUpperCase();
                }
            }
        });

    }

    parserDollar = value => parseInt(value, 10) || '';

    ngOnInit() {
        const that = this;
        // CROWD_TYPE       人群类型
        // DMP_BASE_CALC_RECORD_STATUS      计算状态
        // DMP_OBJECT_STATUS     状态
        const keys = ['CROWD_TYPE', 'DMP_BASE_CALC_RECORD_STATUS', 'DMP_OBJECT_STATUS'];
        that.userGroupService.getParam(keys).subscribe((data: any) => {
            if (data.code === 200) {
                for (let i = 0; i < data.data.length; i++) {
                    for (let j = 0; j < data.data[i].dictionaryItemList.length; j++) {
                        const tempJson = {};
                        const tempListData = {
                            key: data.data[i].dictionaryItemList[j].dicItemKey,
                            value: data.data[i].dictionaryItemList[j].dicItemValue
                        };
                        tempJson[data.data[i].dictionaryItemList[j].dicItemKey] = data.data[i].dictionaryItemList[j].dicItemValue;
                        if (data.data[i].dicKey === 'CROWD_TYPE') {
                            that.crowdTypeMap = Object.assign(that.crowdTypeMap, tempJson);
                            that.crowdSourceList.push(tempListData);
                        } else if (data.data[i].dicKey === 'DMP_BASE_CALC_RECORD_STATUS') {
                            that.calcStausMap = Object.assign(that.calcStausMap, tempJson);
                            that.calcStatusList.push(tempListData);
                        } else if (data.data[i].dicKey === 'DMP_OBJECT_STATUS') {
                            that.statusMap = Object.assign(that.statusMap, tempJson);
                            that.statusList.push(tempListData);
                        }
                    }
                }

                that.route.paramMap.subscribe((params: any) => {

                    if (params && params.params && params.params.id) {
                        that.crowdId = params.params.id;
                    }

                    that.advancedSearchList();

                });

            }
        });
    }

    /**
     * 获取table list 数据
     * @param page
     */
    getList(page?: number) {
        const that = this;
        that.page = page || 1;
        that.advancedSearchList();
    }

    /**
     * 删除人群
     */
    deleteCrowd(data: any) {
        const that = this;
        that.modalService.confirm({
            nzTitle: `提示`,
            nzContent: `确定要删除人群"${data.name}"？`,
            nzOkText: '确认',
            nzOnOk: () => {
                that.userGroupService.deleteCrowdById(data.id).subscribe((res: any) => {
                    let statusStr = 'success';
                    if (res.code === 400) {
                        statusStr = 'error';
                    } else {
                        that.getList();
                    }
                    if (res.message) {
                        that.message.create(statusStr, res.message);
                    }
                });
            },
            nzCancelText: '取消',
            nzOnCancel: () => {
            }
        });
    }

    // 显示更多搜索条件
    advancedSearch() {
        const that = this;
        that.showAdvancedSearch = !that.showAdvancedSearch;
        that.advancedSearchParams = {};
        that.createDate = [];
        that.updateDate = [];
        that.page = 1;
        that.advancedSearchList();
    }

    // 新建用户分群
    goNewCorwd() {
        const that = this;
        that.cacheCurrent({
            page: that.page
        });
        that.goInto({
            name: '新建用户分群',
            url: '/crowd-create/add'
        });
    }

    // 高级搜索 返回列表数据
    advancedSearchList(page?: number) {
        const that = this;

        let json = {
            page: that.page,
            rows: that.pageSize,
            productId: that.productId
        };
        if (that.isSubCrowd) {
            json['parentId'] = that.crowdId;
        }

        const reg = /^[A-Za-z0-9\u4e00-\u9fa5\-_]+$/;
        if (that.advancedSearchParams.name && !reg.test(that.advancedSearchParams.name)) {
            this.message.error('人群名称中含有特殊字符');
            return;
        }
        if (that.advancedSearchParams.creator && !reg.test(that.advancedSearchParams.creator)) {
            this.message.error('创建人中含有特殊字符');
            return;
        }
        if (that.advancedSearchParams['crowdCountStart'] > that.advancedSearchParams['crowdCountEnd']) {
            this.message.error('用户规模范围，起始值应不大于结束值');
            return;
        }

        if (that.advancedSearchParams['crowdCountStart'] > 2147483647 || that.advancedSearchParams['crowdCountEnd'] > 2147483647) {
            this.message.error('用户规模范围，起始值和结束值最大值为2147483647');
            if (that.advancedSearchParams['crowdCountStart'] > 2147483647) {
                that.advancedSearchParams['crowdCountStart'] = null;
            }
            if (that.advancedSearchParams['crowdCountEnd'] > 2147483647) {
                that.advancedSearchParams['crowdCountEnd'] = null;
            }
            return;
        }

        if (that.createDate.length) {
            that.advancedSearchParams['createTimeStart'] = that.formatDate(that.createDate[0]) + ' 00:00:00';
            that.advancedSearchParams['createTimeEnd'] = that.formatDate(that.createDate[1]) + ' 23:59:59';
        } else {
            delete that.advancedSearchParams['createTimeStart'];
            delete that.advancedSearchParams['createTimeEnd'];
        }
        if (that.updateDate.length) {
            that.advancedSearchParams['updateDataTimeStart'] = that.formatDate(that.updateDate[0]) + ' 00:00:00';
            that.advancedSearchParams['updateDataTimeEnd'] = that.formatDate(that.updateDate[1]) + ' 23:59:59';
        } else {
            delete that.advancedSearchParams['updateDataTimeStart'];
            delete that.advancedSearchParams['updateDataTimeEnd'];
        }

        json = Object.assign(json, that.advancedSearchParams);
        console.log(json);
        that.laoding = true;
        that.userGroupService.getCrowdList(json).subscribe((response: any) => {
            that.laoding = false;
            if (response.code === 200) {
                that.tableList = response.data.rows;
                for (let i = 0; i < that.tableList.length; i++) {
                    that.tableList[i].createBy = that.tableList[i].createBy.toUpperCase();
                }
                that.total = response.data.total;
            }
        });
    }

    goInsights(data: any) {
        const that = this;
        that.cacheCurrent({
            page: that.page
        });
        that.goInto({
            name: '画像',
            url: '/user/user-group/insights',
            params: {crowdId: data.id}
        });
    }

    gotoEdit(data) {
        const that = this;
        that.cacheCurrent({
            page: that.page
        });
        that.goInto({
            name: '编辑用户分群',
            url: '/crowd-create/edit',
            params: {
                id: data.id,
                parentId: data.parentId
            }
        });
    }

    export(data: any) {
        const that = this;
        that.cacheCurrent({
            page: that.page
        });
        that.goInto({
            name: '导出',
            url: '/crowd-export',
            params: {
                crowdId: data.id
            }
        });
    }

    view(data: any) {
        const that = this;
        let url = `/crowd-create/view/${data.id}`;
        if (data.parentId) {
            url += '/' + data.parentId;
        }

        that.cacheCurrent({
            page: that.page
        });
        that.goInto({
            name: '查看用户分群',
            url: '/crowd-create/view',
            params: {
                id: data.id,
                parentId: data.parentId
            }
        });

    }

    /**
     * 格式化时间为yyyy-MM-dd hh:mm:ss
     * @param time
     */
    formatDate(time: any): any {
        let year, month, day;
        if (time) {
            year = new Date(time).getFullYear();
            year = year < 10 ? '0' + year : year;
            month = new Date(time).getMonth() + 1;
            month = month < 10 ? '0' + month : month;
            day = new Date(time).getDate();
            day = day < 10 ? '0' + day : day;
            // hours = new Date(time).getHours();
            // hours = hours < 10 ? '0' + hours : hours;
            // minutes = new Date(time).getMinutes();
            // minutes = minutes < 10 ? '0' + minutes : minutes;
            // seconds = new Date(time).getSeconds();
            // seconds = seconds < 10 ? '0' + seconds : seconds;
            return `${year}-${month}-${day}`;
        }
    }
}
