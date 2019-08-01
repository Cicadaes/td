import {Component, OnInit, Injector, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {BaseComponent} from '../../../common/base-component';
import {PipelineCommunicationService} from '../pipeline-communication.service';
import {PipelineBusinessService} from '../pipeline-business.service';
import {PipelineService} from '../pipeline.service';
import {Utiles} from '../../../utils/utiles';
import {differenceInDays, differenceInCalendarDays} from 'date-fns';

@Component({
    selector: 'app-tool-bar',
    templateUrl: './tool-bar.component.html',
    styleUrls: ['./tool-bar.component.less']
})
export class ToolBarComponent extends BaseComponent implements OnInit, OnChanges {

    @Input() pipelineObj: any;
    @Input() campaignObj: any;

    @Output() showRuleEmitter = new EventEmitter<any>();
    @Output() checkPipelineEmitter = new EventEmitter<any>();
    @Output() saveDraftEmitter = new EventEmitter<any>();
    @Output() submitPipelineEmitter = new EventEmitter<any>();

    @Output() updatePipeLineEmitter = new EventEmitter<any>();

    isEdit: boolean; // 是否是编辑
    oldPipeLineName: string; // pipeline 修改前名称
    titleNameWidth: number; // pipeline 名称长度
    pipelineTime: any; // 时间数据
    campaignTime: any;
    textDes: string = ''; // 文字描述 活动已开始/进行 多长时间

    disabledDate = (current: Date): boolean => {
        // const start = differenceInCalendarDays(current, this.campaignTime[0]) < 0;
        // const end = differenceInCalendarDays(current, this.campaignTime[1]) > 0;
        // return start || end;
        const that = this;
        return !(current.getTime() >= that.campaignTime[0].getTime() && current.getTime() <= that.campaignTime[1].getTime() && (new Date().getTime() < current.getTime()) );
    };

    constructor(private injector: Injector,
                public pipelineService: PipelineService,
                public pcs: PipelineCommunicationService,
                public business: PipelineBusinessService,
                public utiles: Utiles) {
        super(injector);
    }

    ngOnInit() {
        
    }

    // 修改pipeline时间
    onChangePipelineTime(e: any) {
        const that = this;
        that.pipelineObj.startTime = that.utiles.formatDate(e[0], 2) + ' 00:00:00';
        that.pipelineObj.endTime = that.utiles.formatDate(e[1], 2) + ' 23:59:59';
        that.updatePipeLine();
    }

    // 提交修改pipeline名称
    updateName() {
        const that = this;
        if (!that.pipelineObj.name || that.pipelineObj.name.length === 0) {
            that.message.create('error', '流程名称不能为空');
            that.restorePipelineName();
            return;
        }
        if (that.pipelineObj.name.length > 26) {
            that.message.create('error', '流程名称不能超过26个字');
            return;
        }
        that.pipelineService.savePipelineName(that.pipelineObj.id, that.pipelineObj.name).subscribe((data: any) => {
            if (data.code === 200) {
                that.message.create('success', '保存成功');
            } else {
                that.restorePipelineName();
            }
        });
        // TODO 请求后端更新数据
        that.isEdit = false;
    }

    // 准备修改pipeline名称
    cachePipelineName() {
        const that = this;
        // 如果pipeline不让编辑 直接return
        if (!that.pcs.isPipelineEdit) {
            return;
        }
        that.isEdit = true;
        that.oldPipeLineName = that.pipelineObj.name;
    }

    // 恢复pipeline名称
    restorePipelineName() {
        const that = this;
        that.pipelineObj.name = that.oldPipeLineName;
        that.checkTitleNameWidth(that.pipelineObj.name);
        that.isEdit = false;
        that.oldPipeLineName = null;
    }

    // 判断titleName的长度
    checkTitleNameWidth(event: any) {
        const that = this;
        let len = 0;
        for (let i = 0; i < event.length; i++) {
            if (event.charCodeAt(i) > 255) {
                len += 15;
            } else {
                len += 7.5;
            }
        }
        if (len < 60) {
            len = 60;
        }
        that.titleNameWidth = len + 10;
    }

    // 返回详情页面
    goBack() {
        history.back();
    }

    showRule() {
        this.showRuleEmitter.emit();
    }

    checkPipeline() {
        this.checkPipelineEmitter.emit();
    }

    saveDraft() {
        if (this.isEdit) {
            this.message.create('error', 'pipeline名称正在编辑状态，不可以保存草稿');
            return;
        }
        this.saveDraftEmitter.emit();
    }

    submitPipeline() {
        if (this.isEdit) {
            this.message.create('error', 'pipeline名称正在编辑状态，不可以提交流程');
            return;
        }
        this.submitPipelineEmitter.emit();
    }

    updatePipeLine() {
        this.updatePipeLineEmitter.emit();
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes['pipelineObj'] && changes['pipelineObj'].firstChange === false) {
            let pipelineObj = changes['pipelineObj'].currentValue;
            this.pipelineTime = [new Date(this.pipelineObj.startTime), new Date(this.pipelineObj.endTime)];
            this.checkTitleNameWidth(this.pipelineObj.name);

            // 处理工具栏显示文本
            this.renderText(this.pipelineObj);
        }

        if (changes['campaignObj'] && changes['campaignObj'].firstChange === false) {
            let campaignObj = changes['campaignObj'].currentValue;

            const today = new Date();
            let time;
            const time1 = new Date(campaignObj.startTime); // .getTime() + 86400000
            const time2 = new Date(campaignObj.endTime);
            // const a = differenceInDays(today, time1);
            // if (a > 0 && a / 1 > 0) {
            //     time = new Date(today.getTime() + 86400000);
            // } else {
            //     time = new Date(time1.getTime() + 86400000);
            // }
            // this.campaignTime = [time, time2];
            this.campaignTime = [time1, time2];
        }
    }

    renderText(pipeline: any) {
        let startTimeInt = this.pcs.startTime.getTime();
        if (pipeline.status === 4) {
            let time = Math.floor((startTimeInt - Date.now()) / (60 * 60 * 1000));
            let day = Math.floor(time / 24);
            let hour = time % 24;
            this.textDes = `距离流程开始还有${day}天${hour}小时`;
        } else if (pipeline.status === 5) {
            let time = Math.floor((Date.now() - startTimeInt) / (60 * 60 * 1000));
            let day = Math.floor(time / 24);
            let hour = time % 24;
            this.textDes = `已进行${day}天${hour}小时`;
        }
    }
}
