import {Component, Input, Output, EventEmitter, Injector, OnInit, OnChanges} from '@angular/core';
import {ActivityCenterService} from '../activity-center.service';
import {BaseComponent} from '../../../common/base-component';

let $scope: any;

@Component({
    selector: 'app-activity-center-add-mcp',
    templateUrl: './activity-center-add-mcp.component.html',
    styleUrls: ['./activity-center-add-mcp.component.less']
})

export class ActivityCenterAddMcpComponent extends BaseComponent implements OnInit, OnChanges {

    public nls: any;
    public vm: any;
    public _manyDotData: any;

    public name = false;
    public time = false;
    public name_length = false;
    public desc_length = false;

    @Output() putManyDotData = new EventEmitter<any>();

    @Input()
    private set manyDotData($value: any) {
        $scope.vm.activityNameValue = $value.name;
        $scope.vm.activityDescriptionValue = $value.description;
        if ($value.startTime && $value.endTime) {
            $scope.vm.activityTimeValue.push($value.startTime);
            $scope.vm.activityTimeValue.push($value.endTime);
        }
        $scope._manyDotData = $value;
    }

    constructor(private activityCenterService: ActivityCenterService,
                private injector: Injector) {

        super(injector);

        this.nls = {
            activityNameLabel: '活动名称',
            activityNamePlaceholder: '请输入活动名称',
            activityTimeLabel: '活动时间',
            activityTimeDescription: '营销活动开始后变更需要联系管理员',
            activityDescriptionLabel: '描述'
        };

        this.vm = {
            activityNameValue: '',
            activityTimeValue: [],
            activityDescriptionValue: '',
            activityNameError: false,
            activityTimeError: false,
            activityDescriptionError: false,
            checkerActivityName: null,
            checkerActivityTime: null,
            checkerActivityDescription: null
        };

        $scope = this;

    }

    handlerCheck_activityName($value: any) {

        if (!$value) {
            this.name = true;
        } else {
            this.name = false;

            if ($value.length > 26) {
                this.name_length = true;
            } else {
                this.name_length = false;
            }
        }

        if (this.name || this.name_length) {
            return false;
        } else {
            return true;
        }

    }

    handlerCheck_activityTime($value: any) {

        if ($value && $value.length > 0) {
            this.time = false;
            return true;
        } else {
            this.time = true;
            return false;
        }

    }

    handlerCheck_activityDesc($value: any) {

        if ($value && $value.length > 80) {
            this.desc_length = true;
            return false;
        } else {
            this.desc_length = false;
            return true;
        }

    }

    /**
     * 禁止选择之前的日期
     */
    disabledBeforeDate = (current: Date): boolean => {
        const nowDate = new Date();
        return nowDate.getTime() > current.getTime();
    }

    handlerOk() {
        let valid = true;
        if (!$scope.handlerCheck_activityName($scope.vm.activityNameValue)) {
            valid = false;
        }

        if (!$scope.handlerCheck_activityTime($scope.vm.activityTimeValue)) {
            valid = false;
        }

        if (!$scope.handlerCheck_activityDesc($scope.vm.activityDescriptionValue)) {
            valid = false;
        }

        if (valid) {
            const date1 = $scope.vm.activityTimeValue[0];
            const date2 = $scope.vm.activityTimeValue[1];

            let time1 = this.commonService.getDateStr(date1);
            let time2 = this.commonService.getDateStr(date2);
            const formatedDateStart = time1 + ' 00:00:00';
            const formatedDateEnd = time2 + ' 23:59:59';

            if ($scope._manyDotData.hasOwnProperty('id')) {
                console.log(222);

                $scope._manyDotData.name = $scope.vm.activityNameValue;
                $scope._manyDotData.startTime = formatedDateStart;
                $scope._manyDotData.endTime = formatedDateEnd;
                $scope._manyDotData.description = $scope.vm.activityDescriptionValue;

                return new Promise((resolve: any, reject: any) => {
                    $scope.activityCenterService.insertManyDotClon($scope._manyDotData).subscribe((response: any) => {
                        if (response.code === 200) {
                            this.message.create('success', '保存成功');
                            resolve(true);
                            this.putManyDotData.emit(response.data.id);
                        } else {
                            this.notification.create('warning', '错误提示', response.message);
                            resolve(false);
                        }
                    }, (err: any) => {
                        reject(false);
                    });
                });
            } else {
                const that = this;
                const parmas = {
                    productId: that.productId,
                    name: $scope.vm.activityNameValue,
                    startTime: formatedDateStart,
                    endTime: formatedDateEnd,
                    type: 2
                };

                if ($scope.vm.activityDescriptionValue) {
                    parmas['description'] = $scope.vm.activityDescriptionValue;
                }

                return new Promise((resolve: any, reject: any) => {
                    $scope.activityCenterService.insertManyDot(parmas).subscribe((response: any) => {
                        if (response.code === 200) {
                            this.message.create('success', `创建成功`);
                            resolve(true);
                            this.putManyDotData.emit(response.data.id);
                        } else {
                            this.notification.create('warning', '错误提示', response.message);
                            resolve(false);
                        }
                    }, (err: any) => {
                        reject(false);
                    });
                });
            }
        }

        return valid;

    }

}
