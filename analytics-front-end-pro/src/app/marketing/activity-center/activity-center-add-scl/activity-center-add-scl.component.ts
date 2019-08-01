import {Component, Input, Output} from '@angular/core';
import {SegmentDataService} from '../segment-data.service';
import {ActivityCenterService} from '../activity-center.service';

let $scope: any;

@Component({
    selector: 'app-activity-center-add-scl',
    templateUrl: './activity-center-add-scl.component.html',
    styleUrls: ['./activity-center-add-scl.component.less']
})

export class ActivityCenterAddSclComponent {

    public nls: any;
    public vm: any;
    _oneDotData: any = {};

    @Input()
    private set oneDotData($value: any) {
        $scope.vm.launchNameValue = $value.name;
        $scope.vm.launchCrowdValue = $value.crowdRefId;
        $scope.vm.launchWaysValue = $value.channelType;
        $scope.vm.launchDescriptionValue = $value.description;
        // if ($value.startTime && $value.endTime) {
        //     $scope.vm.activityTimeValue.push($value.startTime);
        //     $scope.vm.activityTimeValue.push($value.endTime);
        // }
        $scope._oneDotData = $value || {};
    }

    @Input()
    private set launchCrowdSelect($value: any) {

        $scope.vm.launchCrowdSelect = $value;

    }

    @Input()
    private set launchWaysRadio($value: any) {

        if ($value.length) {

            $scope.vm.launchWaysRadio = $value;
            $scope.vm.launchWaysValue = $scope.vm.launchWaysValue || $value[0].value;

        }

    }

    // @Input() private set checkerLaunchName($value : any) {

    //     $scope.vm.checkerLaunchName = $value;

    // }

    // @Input() private set checkerLaunchCrowd($value : any) {

    //     $scope.vm.checkerLaunchCrowd = $value;

    // }

    // @Input() private set checkerLaunchDescription($value : any) {

    //     $scope.vm.checkerLaunchDescription = $value;

    // }

    constructor(public segmentDataService: SegmentDataService,
                private activityCenterService: ActivityCenterService) {

        $scope = this;

        this.nls = {
            launchNameLabel: '活动名称',
            launchNamePlaceholder: '请输入投放名称',
            launchCrowdLabel: '目标人群',
            launchCrowdPlaceholder: '请选择目标人群',
            launchWaysLabel: '投放方式',
            launchDescriptionLabel: '描述'
        };

        this.vm = {
            launchNameValue: '',
            launchCrowdSelect: [],
            launchCrowdValue: undefined,
            launchWaysRadio: [],
            launchWaysValue: undefined,
            launchDescriptionValue: '',
            launchNameError: false,
            launchNameErrorInfo: '',
            launchCrowdError: false,
            launchDescriptionError: false,
            checkerLaunchName: null,
            checkerLaunchCrowd: null,
            checkerLaunchDescription: null
        };

    }

    checkCampaignNameUnique(name: string) {
        return new Promise((resolve, reject) => {
            this.activityCenterService.checkCampaignNameUnique(name).subscribe(res => {
                if (res.code !== 200) {
                    resolve(false);
                    $scope.vm.launchNameErrorInfo = res.message;
                    this.vm.launchNameError = true;
                } else {
                    resolve(true);
                }
            });
        });
    }

    handlerCheck_launchName($value: any) {

        if ($value) {
            if ($value.length > 26) {
                $scope.vm.launchNameErrorInfo = '活动名称长度不能超过26';
                this.vm.launchNameError = true;
                return false;
            }
            this.vm.launchNameError = false;
            return true;
        } else {
            $scope.vm.launchNameErrorInfo = '名称不能为空';
            this.vm.launchNameError = true;
            return false;
        }

    }

    handlerCheck_launchCrowd($value: any) {

        if ($value || this.vm.launchWaysValue === 4) { // 投放方式是“公众号群发”，不会有人群。
            this.vm.launchCrowdError = false;
            return true;
        } else {
            this.vm.launchCrowdError = true;
            return false;
        }

    }

    handlerCheck_launchDescription($value: any) {

        if ($value && $value.length > 80) {
            $scope.vm.launchDescriptionError = true;
            return false;
        }
        this.vm.launchDescriptionError = false;
        return true;

    }

    /**
     * 刚变投放方式
     * @param value
     */
    changeSegmentType(value: any) {
        this.segmentDataService.segmentInfo = {};
        if (value == 4) { // 投放方式是“公众号群发”，不会有人群。
            $scope.vm.launchCrowdValue = null;
        }
    }

    async handlerOk() {

        let valid = true;

        if (!$scope.handlerCheck_launchName($scope.vm.launchNameValue)) {
            valid = false;
        }

        if (this.segmentDataService.isUpdate === 2) {
            const flag = await $scope.checkCampaignNameUnique($scope.vm.launchNameValue);
            if (!flag) {
                valid = false;
            }
        }

        if (!$scope.handlerCheck_launchCrowd($scope.vm.launchCrowdValue)) {
            valid = false;
        }

        if (!$scope.handlerCheck_launchDescription($scope.vm.launchDescriptionValue)) {
            valid = false;
        }

        return valid;

    }

}
