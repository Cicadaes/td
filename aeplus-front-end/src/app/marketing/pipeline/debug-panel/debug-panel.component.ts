import {Component, OnInit, Injector, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {BaseComponent} from '../../../common/base-component';
import {PipelineCommunicationService} from '../pipeline-communication.service';
import {PipelineBusinessService} from '../pipeline-business.service';
import {PipelineService} from '../pipeline.service';
import {Utiles} from '../../../utils/utiles';
import {differenceInDays, differenceInCalendarDays} from 'date-fns';

@Component({
    selector: 'app-debug-panel',
    templateUrl: './debug-panel.component.html',
    styleUrls: ['./debug-panel.component.less']
})
export class DebugPanelComponent extends BaseComponent implements OnInit {

    @Input() pipelineId: any;
    @Input() isCheck: any;
    @Input() pipelineObj: any;

    @Output() getPipelineDetailEmitter = new EventEmitter<any>();
    @Output() checkPipelineEmitter = new EventEmitter<any>();

    isShowTestModal: boolean = false;  // 是否显示测试弹框选项

    debugSelectCrowdName: string;   // debug选中人群名称
    debugSelectCrowd: any;          // debug选中的人群
    showDebugCrowdList: boolean;    // 是否显示测试人群列表
    debugCrowdList: any;            // 测试人群列表
    debugCrowdListPage: number = 1;     // 测试人群列表页数
    debugCrowdListRows: number = 10;     // 测试人群列表每页条数
    debugData: any = {    // debug默认数据
        debugCrowdId: 0,
        debugCrowdRefId: 0,
        skipEntrance: true,
        skipFilter: 'true',
        skipHourMeter: 'true',
        skipSplit: 'true',
        skipTrigger: 'true'
    };
    debugJson: any = {};

    constructor(private injector: Injector,
                public pipelineService: PipelineService,
                public pcs: PipelineCommunicationService,
                public business: PipelineBusinessService,
                public utiles: Utiles) {
        super(injector);
    }

    ngOnInit() {
        const that = this;
        document.addEventListener('click', (e: any) => {
            if (that.showDebugCrowdList) {
                that.showDebugCrowdList = !that.showDebugCrowdList;
            }
        });
    }

    setDebug() {
        const that = this;

        if (!that.debugSelectCrowd) {
            that.message.create('error', '请选择人群');
            return;
        }

        const json: any = Object.assign({}, that.debugData);
        json['debugCrowd'] = that.debugSelectCrowd;
        json.debugCrowdId = that.debugSelectCrowd.id;
        json.debugCrowdRefId = that.debugSelectCrowd.refId;

        if (that.debugData.skipFilter === 'true') {
            json.skipFilter = true;
        } else {
            json.skipFilter = false;
        }
        if (that.debugData.skipHourMeter === 'true') {
            json.skipHourMeter = true;
        } else {
            json.skipHourMeter = false;
        }
        if (that.debugData.skipSplit === 'true') {
            json.skipSplit = true;
        } else {
            json.skipSplit = false;
        }
        if (that.debugData.skipTrigger === 'true') {
            json.skipTrigger = true;
        } else {
            json.skipTrigger = false;
        }

        this.debugJson = json;

        that.pipelineService.createCrowd(that.debugSelectCrowd.name).subscribe((data: any) => {
            if (data.code === 200) {
                that.debugJson['debugCrowd'] = data.data;
                json.debugCrowdId = data.data.id;
                json.debugCrowdRefId = data.data.refId;
                that.debugStart();
            } else if (data.code === 7601) {
                that.pipelineService.getCrowdByCrowdName(that.debugSelectCrowd.name).subscribe((result: any) => {
                    if (result.code === 200 && result.data.id) {
                        that.debugJson['debugCrowd'] = result.data;
                        json.debugCrowdId = result.data.id;
                        json.debugCrowdRefId = result.data.refId;
                        that.debugStart();
                    }
                })
            } else {
                that.message.create('error', data.message);
            }
        })
    }

    /**
     * 显示测试模态框
     */
    showTest() {
        const that = this;

        if (!that.isCheck) {
            that.modalService.confirm({
                nzTitle: '提示',
                nzContent: '请先校验通过后再进行流程测试',
                nzOkText: '立即校验',
                nzOnOk: () => {
                    that.checkPipeline();
                }
            });
            return;
        }

        that.isShowTestModal = true;
    }

    /**
     * 关闭测试弹框处理
     */
    cancel() {
        const that = this;
        that.isShowTestModal = false;

        that.debugData.skipFilter = 'true';
        that.debugData.skipHourMeter = 'true';
        that.debugData.skipSplit = 'true';
        that.debugData.skipTrigger = 'true';
    }

    debugStart() {
        let that = this;
        that.pipelineService.debugStart(that.debugJson, that.pipelineId).subscribe((debugdata: any) => {
            if (debugdata.code === 200) {
                if (debugdata.data.testStatus === 1) {
                    that.pcs.isPipelineEdit = false;
                    that.pipelineObj.testStatus = 1;
                }
                that.cancel();

                that.getPipelineDetail();
            }
        })
    }

    /**
     * 暂停 pipeline测试
     */
    debugPause() {
        const that = this;
        that.pipelineService.debugPause(that.pipelineId).subscribe((data: any) => {
            if (data.code === 200) {
                that.getPipelineDetail();
            }
        })
    }

    /**
     * 恢复 pipeline测试
     */
    debugResume() {
        const that = this;
        that.pipelineService.debugResume(that.pipelineId).subscribe((data: any) => {
            if (data.code === 200) {
                that.getPipelineDetail();
            }
        })
    }

    /**
     * 停止 pipeline测试
     */
    debugAbort() {
        const that = this;
        that.pipelineService.debugAbort(that.pipelineId).subscribe((data: any) => {
            if (data.code === 200) {
                that.getPipelineDetail();
            }
        })
    }

    /**
     * 显示测试模态框 测试人群下拉列表
     */
    showTestCrowdList(e: any) {
        e.stopPropagation();
        const that = this;
        that.showDebugCrowdList = !that.showDebugCrowdList;
        that.debugCrowdList = [];
        that.getTestCrowdList();
    }

    /**
     * 获取测试模态框 测试人群下拉列表数据
     */
    getTestCrowdList() {
        const that = this;
        that.pipelineService.getCrowdList(that.debugSelectCrowdName || '', that.debugCrowdListPage, that.debugCrowdListRows).subscribe((result: any) => {
            if (result.code === 200) {
                that.debugCrowdList = result.data;
            }
        });
    }

    /**
     * 选择测试人群
     */
    selectCrowd(crowd: any) {
        const that = this;
        that.debugSelectCrowdName = crowd.name;
        that.debugSelectCrowd = crowd;
    }

    getPipelineDetail() {
        this.getPipelineDetailEmitter.emit('debug');
    }

    checkPipeline() {
        this.checkPipelineEmitter.emit();
    }

}
