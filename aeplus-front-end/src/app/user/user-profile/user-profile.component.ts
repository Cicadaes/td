import {Component, Injector, OnInit, OnChanges} from '@angular/core';
import {UserProfileService} from './user-profile.service';
import {BaseComponent} from '../../common/base-component';

let $scope;

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.less'],
    providers: [UserProfileService]
})
// zhanghong code
export class UserProfileComponent extends BaseComponent implements OnInit, OnChanges {

    public accountId: any;
    public accountType: any;
    public accountOffset: any;
    public offset: any;
    public distinctId: any;
    public baseInfo: any;
    public indexAnalysis: any;
    public behaviorTrajectory: any;

    constructor(private injector: Injector,
                private userProfileService: UserProfileService) {

        super(injector);
        this.initRouterList('用户档案');

        $scope = this;

    }

    ngOnInit() {

        $scope.accountId = $scope.route.snapshot.params['accountId'];
        $scope.accountType = $scope.route.snapshot.params['accountType'];
        $scope.accountOffset = $scope.route.snapshot.params['accountOffset'];
        $scope.offset = $scope.route.snapshot.params['offset'];
        $scope.distinctId = $scope.route.snapshot.params['distinctId'];

        $scope.baseInfo = {
            headerMajor: $scope.distinctId,
            headerMinor: '用户 ID',
            baseInfo: [],
            theCrowd: [],
            theLabel: [],
            theInvalidLabel: [],
        };

        $scope.indexAnalysis = {
            dateRange: [],
            eventSelected: {},
            eventSelect: [],
            eventPropSelected: {},
            eventPropSelect: [],
            frequencySelected: {label: '天', value: 'day'},
            frequencySelect: [{label: '天', value: 'day'}, {label: '周', value: 'week'}, {label: '月', value: 'month'}],
            chartData: []
        };

        $scope.behaviorTrajectory = {
            dateRange: [],
            trajectoryList: [],
            trajectoryDetail: [],
            trajectoryPageSize: 10,
            trajectoryPageIndex: 1,
            trajectoryMore: false,
            chartData: []
        };

        // 执行初始化
        $scope.initBaseInfo();
        $scope.getEventDate();
        // $scope.initIndexAnalysis_dateRange(function () {
        //     $scope.initIndexAnalysis_eventSelect(function () {
        //         $scope.initIndexAnalysis_eventPropSelect(function () {
        //             $scope.initIndexAnalysis_chartData();
        //         });
        //     });
        // });

        // $scope.initBehaviorTrajectory_dataRange(function () {
        //     $scope.initBehaviorTrajectory_trajectoryList();
        //     $scope.initBehaviorTrajectory_chartData();
        // });

    }

    /**
     * 基本
     */
    initBaseInfo($next ?: any) {

        const _that = this;

        const p = {
            productId: $scope.productId,
            accountId: $scope.accountId,
            accountOffset: $scope.accountOffset || '',
            offset: $scope.offset,
            distinctId: $scope.distinctId
        };

        if (this.accountType) {
            p['accountType'] = $scope.accountType;
        }

        $scope.userProfileService.req_crowds(p).subscribe((response: any) => {
            let a, b, i;
            for (a = [], i = 0; b = response.data[i]; i++) {
                a.push({
                    name: b
                });
            }
            $scope.baseInfo.theCrowd = a;
        });

        $scope.userProfileService.req_label(p).subscribe((response: any) => {
            let a, b, i, n, m, s;
             for (a = [], i = 0; b = response.data.validResult[i]; i++) {
                 a.push({
                     name: b
                 });
             }
             for (n = [], s = 0; m = response.data.inValidResult[s]; s++) {
                n.push({
                    name: m
                });
            }
             $scope.baseInfo.theLabel = a;
             $scope.baseInfo.theInvalidLabel = n;
        });

        const finalParam = {
            productId: p.productId,
            // accountId: $param.accountId,
            // accountType: $param.accountType !== undefined ? $param.accountType : '',
            // accountOffset: $param.accountOffset,
            offset: p.offset,
            distinctId: p.distinctId
        };
        if (p.accountOffset) {
            finalParam['accountOffset'] = p.accountOffset;
        }

        // req
        $scope.userProfileService.req_listDetails().subscribe((response: any) => {
            const groupInfo = response.data;
            $scope.userProfileService.req_profileDetail(finalParam).subscribe((response2: any) => {
                const profileData = response2.data;
                let $a, $b, _a, _b, a, b, c, i, j, k;
                // 值
                for ($a = [], $b = {}, _a = profileData, _b = groupInfo, i = 0; a = _a[i]; i++) {
                    // 组
                    for (j = 0; b = _b[j]; j++) {
                        // 如果匹配
                        if (a.key === b.esfieldname) {
                            // 添加组
                            if (!(c = $b[k = b.groupid])) {
                                $a.push(c = $b[k] = {name: b.groupName, value: []});
                            }
                            // 添加值
                            switch (b.displayType) {
                                default:
                                    c.value.push({name: b.displayname, value: a.value});
                            }
                            break;
                        }
                    }
                }

                if (a && a.length === 0) {
                    $scope.notification.create('error', '提示', '暂未对用户属性进行配置，请在管理-用户配置-用户洞察配置-基础属性配置中进行配置，如果没权限，请联系管理员。');
                }

                $scope.baseInfo.baseInfo = $a;
            });
        });
    }

    getEventDate($next?: any) {
        $scope.userProfileService.req_eventDate().subscribe((response: any) => {
            let a = [], b;
            if (response.data.startDate && response.data.endDate) {
                a = [
                    new Date(Number((b = response.data.startDate.split('-'))[0]), Number(b[1]) - 1, Number(b[2])),
                    new Date(Number((b = response.data.endDate.split('-'))[0]), Number(b[1]) - 1, Number(b[2]))
                ];
            } else {
                const date = this.globals.getDateRangeByLastDay(-30);
                a = [new Date(date.start), new Date(date.end)];
            }
            $scope.indexAnalysis.dateRange = a;
            $scope.behaviorTrajectory.dateRange = a;
//            指数分析
            $scope.initIndexAnalysis_eventSelect(function () {
                $scope.initIndexAnalysis_eventPropSelect(function () {
                    $scope.initIndexAnalysis_chartData();
                });
            });
 //           行为轨迹
            $scope.initBehaviorTrajectory_trajectoryList();
            $scope.initBehaviorTrajectory_chartData();

        });
    }

    /**
     * 指数分析 (不用)
     */
    initIndexAnalysis_dateRange($next ?: any) {

        $scope.userProfileService.req_eventDate().subscribe((response: any) => {
            let a, b;
            a = [
                new Date(Number((b = response.data.startDate.split('-'))[0]), Number(b[1]) - 1, Number(b[2])),
                new Date(Number((b = response.data.endDate.split('-'))[0]), Number(b[1]) - 1, Number(b[2]))
            ];
            $scope.indexAnalysis.dateRange = a;
            // 执行下一步
            if ($next) {
                $next();
            }
        });

    }

    initIndexAnalysis_eventSelect($next ?: any) {

        const $param = {
            productId: $scope.productId,
            accountOffset: $scope.accountOffset,
            offset: $scope.offset,
            dateRange: $scope.indexAnalysis.dateRange
        };

        const date1 = $param.dateRange[0];
        const date2 = $param.dateRange[1];

        const param = {
            productId: $param.productId,
            // accountOffset: $param.accountOffset,
            offset: $param.offset,
            startDate: this.commonService.getDateStr(date1),
            endDate: this.commonService.getDateStr(date2)
        };

        if ($param.accountOffset) {
            param['accountOffset'] = $param.accountOffset;
        }

        $scope.userProfileService.req_eventList(param).subscribe((response: any) => {
            let a, b, i;
            for (a = [], i = 0; b = response.data[i]; i++) {
                a.push({
                    label: b.eventName,
                    value: b.eventId
                });
            }
            $scope.indexAnalysis.eventSelected = a[0];
            $scope.indexAnalysis.eventSelect = a;

            // 执行下一步
            if ($next) {
                $next();
            }
        });

    }

    initIndexAnalysis_eventPropSelect($next ?: any) {

        if ($scope.indexAnalysis.eventSelected != null) {

            $scope.userProfileService.req_eventPropertyList($scope.indexAnalysis.eventSelected.value).subscribe((response: any) => {
                let a, b, i;
                for (a = [], i = 0; b = response.data[i]; i++) {
                    a.push({
                        label: b.attrName,
                        value: b.esFieldName
                    });
                }
                $scope.indexAnalysis.eventPropSelected = a[0];
                $scope.indexAnalysis.eventPropSelect = a;
                // 执行下一步
                if ($next) {
                    $next();
                }
            });
        }
    }

    initIndexAnalysis_chartData($next ?: any) {

        const $param = {
            productId: $scope.productId,
            accountOffset: $scope.accountOffset,
            offset: $scope.offset,
            dateRange: $scope.indexAnalysis.dateRange,
            event: $scope.indexAnalysis.eventSelected.value,
            eventProp: $scope.indexAnalysis.eventPropSelected.value,
            frequency: $scope.indexAnalysis.frequencySelected.value
        };

        const date1 = $param.dateRange[0];
        const date2 = $param.dateRange[1];

        const p = {
            productId: $param.productId,
            // accountoffset: $param.accountOffset,
            offset: $param.offset,
            startDate: this.commonService.getDateStr(date1),
            endDate: this.commonService.getDateStr(date2),
            eventId: $param.event,
            esField: $param.eventProp,
            queryType: $param.frequency
        };
        if ($param.accountOffset) {
            p['accountOffset'] = $param.accountOffset;
        }

        $scope.userProfileService.req_userEventReport(p).subscribe((response: any) => {
            let a, b, i;
            for (a = [], i = 0; b = response.data[i]; i++) {
                a.push({
                    label: b.dateStr,
                    value: b.value
                });
            }
            if (a) {
                $scope.indexAnalysis.chartData = a;
            }

            // 执行下一步
            if ($next) {
                $next();
            }
        });

    }

    handlerIndexAnalysis_eventChange($data: any) {

        $scope.indexAnalysis.eventSelected = $data;

        $scope.initIndexAnalysis_eventPropSelect();

    }
    handlerIndexAnalysis_eventpropChange($data: any) {

        $scope.indexAnalysis.eventPropSelected = $data;

    }

    handlerIndexAnalysis_lookUp($data: any) {

        $scope.indexAnalysis.dateRange = $data.dateRange;
        $scope.indexAnalysis.eventSelected = $data.eventSelected;
        $scope.indexAnalysis.eventPropSelected = $data.eventPropSelected;
        $scope.indexAnalysis.frequencySelected = $data.frequencySelected;
        $scope.initIndexAnalysis_chartData();

    }

    /**
     * 行为轨迹  (不用)
     */
    initBehaviorTrajectory_dataRange($next ?: any) {

        $scope.userProfileService.req_eventDate().subscribe((response: any) => {
            let a, b;
            a = [
                new Date(Number((b = response.data.startDate.split('-'))[0]), Number(b[1]) - 1, Number(b[2])),
                new Date(Number((b = response.data.endDate.split('-'))[0]), Number(b[1]) - 1, Number(b[2]))
            ];
            $scope.behaviorTrajectory.dateRange = a;

            // 执行下一步
            if ($next) {
                $next();
            }
        });

    }

    initBehaviorTrajectory_trajectoryList($next ?: any) {

        const p = {
            productId: $scope.productId,
            accountOffset: $scope.accountOffset,
            offset: $scope.offset,
            dateRange: $scope.behaviorTrajectory.dateRange,
            pageSize: $scope.behaviorTrajectory.trajectoryPageSize,
            pageIndex: $scope.behaviorTrajectory.trajectoryPageIndex
        };

        $scope.userProfileService.req_eventHistory(p).subscribe((response: any) => {

            let a, b, c, d, i, j;
            if (response && response.data && response.data.dataList && response.data.dataList.length > 0) {
                for (a = [], i = 0; b = response.data.dataList[i]; i++) {
                    for (d = b.date, j = 0; c = b.list[j]; j++) {
                        a.push({
                            id: c.id,
                            date: d,
                            time: c.time,
                            description: c.eventName,
                            eventId: c.eventId,
                            accountoffset: c.accountoffset,
                            offset: c.offset,
                            startTime: c.startTime
                        });
                    }
                }
            } else {
                a = [];
            }
            a.total = response.data.totalCount;

            if (a && a.length > 0) {
                $scope.behaviorTrajectory.trajectoryList = $scope.behaviorTrajectory.trajectoryList.concat(a);
            } else {
                $scope.behaviorTrajectory.trajectoryList = a;
            }
            const trajectoryPageSize = $scope.behaviorTrajectory.trajectoryPageSize;
            const trajectoryPageIndex = $scope.behaviorTrajectory.trajectoryPageIndex;
            $scope.behaviorTrajectory.trajectoryMore = trajectoryPageSize * trajectoryPageIndex < a.total;

            $scope.behaviorTrajectory.loading = false;

            // 执行下一步
            if ($next) {
                $next();
            }
        });

    }

    initBehaviorTrajectory_chartData($next ?: any) {

        const p = {
            productId: $scope.productId,
            accountOffset: $scope.accountOffset,
            offset: $scope.offset,
            dateRange: $scope.behaviorTrajectory.dateRange
        };

        $scope.userProfileService.req_eventReport(p).subscribe((response: any) => {
            let a, b, i;
            for (a = [], i = 0; b = response.data[i]; i++) {
                a.push({
                    name: b.eventName,
                    value: b.eventRate,
                    valueByCount: b.eventCount
                });
            }
            $scope.behaviorTrajectory.chartData = a;

            // 执行下一步
            if ($next) {
                $next();
            }
        });

    }

    handlerBehaviorTrajectory_trajectoryDetail($item: any) {
        const params = $item || {};
        params.dateRange = $scope.behaviorTrajectory.dateRange;
        $scope.userProfileService.req_userProfileBehaviorDetails(params).subscribe((response: any) => {
            let a, b, c, i, j;
            if (response && response.data && response.data.length > 0) {
                for (a = [], i = 0; c = response.data[i]; i++) {
                    for (j in b = [], a.push(b), c) {
                        if (c[j] !== null) {
                            b.push({
                                name: j,
                                value: c[j]
                            });
                        }
                    }
                }
            }
            $scope.behaviorTrajectory.trajectoryDetail = a;
        });

    }

    // 用户档案-行为轨迹-显示更多
    handlerBehaviorTrajectory_trajectoryMore($event: any) {

        if (!$scope.behaviorTrajectory.loading) {
            $scope.behaviorTrajectory.loading = true;
            $scope.behaviorTrajectory.trajectoryPageIndex++;
            $scope.initBehaviorTrajectory_trajectoryList();
        }
    }

    handlerBehaviorTrajectory_dateChange($data: any) {
        if ($data) {
            $scope.behaviorTrajectory.dateRange = $data.dateRange;
            if ($data.loading) {
                // 找不着
                $scope.behaviorTrajectory.trajectoryPageIndex = 1;
                $scope.behaviorTrajectory.trajectoryList = [], $scope.initBehaviorTrajectory_trajectoryList();

                $scope.behaviorTrajectory.dateRange = $data.dateRange, $scope.initBehaviorTrajectory_chartData();
            }
        }
    }

}
