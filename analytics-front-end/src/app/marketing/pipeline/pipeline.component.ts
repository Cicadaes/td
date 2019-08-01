import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Injector } from '@angular/core';
import { Utiles } from '../../utils/utiles';
import { PipelineService } from './pipeline.service';
import { PipelineCommunicationService } from './pipeline-communication.service';
import { PipelineBusinessService } from './pipeline-business.service';
import cloneDeep from 'lodash/cloneDeep';
import difference from 'lodash/difference';
import defaultsDeep from 'lodash/defaultsDeep';
import * as joint from 'jointjs';
import { BaseComponent } from '../../common/base-component';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.less'],
  providers: [Utiles]
})
export class PipelineComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('report_email') report_email: ElementRef;

  @ViewChild('report_push') report_push: ElementRef;

  @ViewChild('report_sms') report_sms: ElementRef;

  @ViewChild('report_insights') report_insights: ElementRef;

  reportObj: any = {};
  crowdIdInput: any = 310;
  campaignObj: any = {};

  pipelineId: number; // pipelineId
  campaignId: number; // 活动Id
  campaignStatus: number; // 营销活动状态  -1、已删除 0、草稿 1、等待开始 2、进行中 3、结束

  isOperatorShow: boolean; // 是否显示左边栏
  overflow: boolean = true; // 修改右边框样式

  pipelineComponentArr: any; // 算子列表
  diagramObj: any = {}; // pipeLine nodeList数据
  pipelineObj: any = {}; // pipeline 数据
  showRightContent: any; // 保存算子类型 用于判断右边栏显示的是哪个算子页面
  removeFlag: boolean; // 是否可以删除pipeline中的线

  linkSetTimeoutId: any = {}; // 连线时setTimeout的id
  moveNodeSetTimeoutId: any = {}; // 移动节点时setTimeout的id
  moveLinkSetTimeoutId: any; // 移动线试setTimeout的id

  nodeMap: any = {}; // 存放自己生成的nodeId和svg画布需要的id的Map key为自己生成的nodeId
  lineMap: any = {}; // 存放自己生成的lineNodeId和svg画布需要啊的id的Map  key为自己生成的nodeId

  graph = new joint.dia.Graph(); // 新建svg图表对象
  paper: any; // 用来全局保存joint画布的对象

  reportNodeData: any; // push或短信节点数据 用于显示报告页
  title: string; // 报告弹框title

  errNodeList: any = []; //存放检测报错的节点 再次检测通过后会去掉已改正的
  tipPanelStyleDisplay: string = 'none'; // 删除浮层样式 是否显示 ‘none’ || ‘block’;
  tipDeleteShow: any = false;
  tipReportShow: any = false;
  tipDetailShow: any = false;

  top: string = '0'; // 删除浮层样式 所在位置距上边框
  left: string = '0'; // 删除浮层样式 所在位置距下边框
  deleteNodeId: string; // 显示浮层的node节点Id jointjs生成的id
  relDeleteNodeId: string; // 真正要删除时候显示的组件ID
  orignX: number = 0; // pipeline origin横坐标
  orignY: number = 0; // pipeline origin纵坐标
  scaleX: number = 1; // pipeline 放大x轴倍数 默认1
  scaleY: number = 1; // pipeline 放大y轴倍数 默认1
  defaultNodeX: number = 0; // 用于移动节点时记录节点的位置
  defaultNodeY: number = 0; // 用于移动节点时记录节点的位置
  lastNodeId: number; // 用于移动节点时记录上次移动节点的id
  transformStyle: string = 'scale(1)'; // pipeline样式

  isCheck: boolean; // 是否校验通过
  subscript: any; // 创建线订阅

  modalRef: NzModalRef;

  constructor(
    private injector: Injector,
    public utiles: Utiles,
    public pipelineService: PipelineService,
    public pcs: PipelineCommunicationService,
    public business: PipelineBusinessService
  ) {
    super(injector);

    const that = this;
    that.isOperatorShow = true;
    that.diagramObj = {
      nodeDefinitionList: []
    };
    that.removeFlag = false;
    that.pipelineId = that.route.snapshot.params['pipelineId'] || 2195; // TODO 占时写死为了方便调试
    that.campaignId = that.route.snapshot.params['campaignId'] || 1808; // TODO 占时写死为了方便测试
    that.pcs.pipelineId = that.pipelineId;
    that.pcs.campaignId = that.campaignId;

    that.subscript = that.pcs.lineChange$.subscribe((data: any) => {
      that.changeLinks(data);
    });
  }

  ngOnInit() {
    const that = this;
    that.pipelineService.getOperatorList().subscribe((operatorList: any) => {
      that.pipelineComponentArr = operatorList.data.data;
      for (let i = 0; i < that.pipelineComponentArr.length; i++) {
        const obj = that.pipelineComponentArr[i];
        obj.type = that.pcs.typeValueMap[obj.id];
      }
    });

    that.paper = that.business.initPaper(that);
    that.getPipelineDetail();

    // 算子点击事件
    that.paper.on('cell:pointerclick', (e: any) => {
      if (!e.model.attributes || e.model.attributes.type === 'link') {
        return;
      }
      if (!e.model.data) {
        return;
      }

      let nodeData = e.model.data;

      if (nodeData && that.pcs.nodeData && nodeData.id === that.pcs.nodeData.id && that.showRightContent) {
        return;
      }

      if (that.pcs.isPipelineEdit && that.showRightContent) {
        that.updatePipeLine();
      }

      that.showRightContent = '';
      that.pcs.nodeData = JSON.parse(JSON.stringify(nodeData));

      setTimeout(function() {
        that.showRightContent = nodeData.type;
      }, 100);

      // 获取当前组件出去的线，仅仅为触发器使用，待优化
      const node = that.graph.getCell(that.nodeMap[nodeData.id]);
      const links = that.graph.getConnectedLinks(node, { outbound: true });
      that.pcs.nodeLinks = links;
    });

    // 画布除组件之外的点击事件
    that.paper.on('blank:pointerclick', async () => {
      if (that.pcs.nodeData && that.pcs.nodeData.groupName && that.pcs.isPipelineEdit) {
        await new Promise((resolve, reject) => {
          that.pipelineService
            .saveSegmentGroup(that.pcs.campaignId, that.pcs.nodeData.groupName, localStorage.getItem('productId'))
            .subscribe((data: any) => {
              if (data.code === 200) {
                that.pcs.nodeData.groupId = data.data.id;
              }
              resolve();
            });
        });
      }

      if (that.pcs.isPipelineEdit && that.showRightContent) {
        that.updatePipeLine();
      } else {
        that.showRightContent = '';
      }
    });

    // 点击画布空白处
    that.paper.on('blank:pointerdown', (e: any, x: any, y: any) => {
      var svg = joint.V(that.paper.svg);
      svg.node.onmousemove = (e: any) => {
        that.orignX = that.utiles.floatMul(
          that.utiles.floatSub(that.utiles.floatDiv(e.offsetX, that.scaleX), x),
          that.scaleX
        );
        that.orignY = that.utiles.floatMul(
          that.utiles.floatSub(that.utiles.floatDiv(e.offsetY, that.scaleY), y),
          that.scaleY
        );
        that.paper.setOrigin(that.orignX, that.orignY);
      };
    });

    // 节点移动事件
    that.paper.on('cell:pointermove', (e: any) => {
      if (!e.model.attributes || e.model.attributes.type === 'link') {
        return;
      }
      if (that.tipPanelStyleDisplay === 'block') {
        that.top = `${(+e.model.attributes.position.y + 37) * that.scaleY + that.orignY}px`;
        that.left = `${(+e.model.attributes.position.x + 2) * that.scaleX + that.orignX}px`;
      }
      if (that.lastNodeId !== e.model.data.id) {
        that.defaultNodeX = that.diagramObj.nodeDefinitionList[e.model.data.index]['x'];
        that.defaultNodeY = that.diagramObj.nodeDefinitionList[e.model.data.index]['y'];
      }
      that.lastNodeId = e.model.data.id;
      let tempX = +e.model.attributes.position.x - that.defaultNodeX;
      let tempY = +e.model.attributes.position.y - that.defaultNodeY;
      let lineList = that.graph.getConnectedLinks(e.model, { outbound: true });
      for (let i = 0; i < lineList.length; i++) {
        const obj = lineList[i];
        if (obj.attributes && obj.attributes.target && obj.attributes.target['x'] && obj.attributes.target['y']) {
          obj.attributes.target['x'] = +obj.attributes.target['x'] + tempX;
          obj.attributes.target['y'] = +obj.attributes.target['y'] + tempY;
          obj.data['x'] = obj.attributes.target['x'];
          obj.data['y'] = obj.attributes.target['y'];
          that.removeFlag = true;
          that.graph.removeCells([obj]);
          that.removeFlag = false;
          that.graph.addCell(obj);
          that.diagramObj.edgeDefinitionList.push(obj.data);
        }
      }
      that.defaultNodeX = +e.model.attributes.position.x;
      that.defaultNodeY = +e.model.attributes.position.y;
      if (that.moveNodeSetTimeoutId[e.model.data.id]) {
        clearTimeout(that.moveNodeSetTimeoutId[e.model.data.id]);
      }
      e.model.data.x = e.model.attributes.position.x;
      e.model.data.y = e.model.attributes.position.y;
      that.diagramObj.nodeDefinitionList[e.model.data.index]['x'] = parseInt(e.model.attributes.position.x);
      that.diagramObj.nodeDefinitionList[e.model.data.index]['y'] = parseInt(e.model.attributes.position.y);
      that.moveNodeSetTimeoutId[e.model.data.id] = setTimeout(function() {
        if (that.pcs.isPipelineEdit) {
          that.updateSimple();
        }
      }, 1000);
    });

    // pointerup
    that.paper.on('blank:pointerup', (e: any) => {
      var svg = joint.V(that.paper.svg);
      svg.node.onmousemove = '';
    });

    // 鼠标移动到节点上触发
    that.paper.on('cell:mouseover', (e: any) => {
      // 测试状态不显示
      if (that.pipelineObj.status == '9' || !e.model.data || !e.model.data.type) {
        return;
      }

      if (that.pcs.isPipelineEdit && e.model.data.type !== 'entrance') {
        that.tipDeleteShow = true;
      } else {
        that.tipDeleteShow = false;
      }

      if (
        !that.pcs.isPipelineEdit &&
        (that.pipelineObj.status == '5' || that.pipelineObj.status == '7' || that.pipelineObj.status == '8') &&
        (e.model.data.type == 'push' || e.model.data.type == 'shortMessage' || e.model.data.type == 'mail')
      ) {
        that.tipReportShow = true;
      } else {
        that.tipReportShow = false;
      }

      if (
        !that.pcs.isPipelineEdit &&
        (that.pipelineObj.status == '5' || that.pipelineObj.status == '7' || that.pipelineObj.status == '8') &&
        e.model.data.type == 'generate'
      ) {
        that.tipDetailShow = true;
      } else {
        that.tipDetailShow = false;
      }

      //            if (e && e.model && (e.model.attributes.type === 'link' || e.model.data.type === 'entrance')) {
      //                return;
      //            }
      if (
        e.model.data.type === 'push' ||
        e.model.data.type === 'shortMessage' ||
        e.model.data.type === 'mail' ||
        e.model.data.type === 'generate'
      ) {
        that.reportNodeData = e.model.data;
      } else {
        that.reportNodeData = null;
      }

      if (that.tipDeleteShow || that.tipReportShow || that.tipDetailShow) {
        that.tipPanelStyleDisplay = 'block';
        if (e.model.attributes.position) {
          that.top = `${(+e.model.attributes.position.y + 37) * that.scaleY + that.orignY}px`;
          that.left = `${(+e.model.attributes.position.x + 2) * that.scaleX + that.orignX}px`;
        }
        that.deleteNodeId = e.model.id;
      }
    });

    // 鼠标离开节点触发
    that.paper.on('cell:mouseout', (e: any) => {
      that.tipPanelStyleDisplay = 'none';
    });

    // 改变link获取对象
    that.graph.on('change:source change:target', (link: any) => {
      if (that.linkSetTimeoutId[link.id]) {
        clearTimeout(that.linkSetTimeoutId[link.id]);
      }
      that.linkSetTimeoutId[link.id] = setTimeout(() => {
        const sourceId = link.attributes.source.id;
        const targetId = link.attributes.target.id;

        // console.log('change:source change:target-' + sourceId + ':' + targetId);

        if (sourceId === targetId) {
          that.removeFlag = true;
          that.graph.removeCells([link]);
          that.removeFlag = false;
          return;
        }
        const sourceNode = that.graph.getCell(sourceId);
        const targetNode = that.graph.getCell(targetId);
        //                const tempNode = that.pcs.nodeData;  // 赋值到零时变量 方便使用
        // 如果是分流器和触发器 改变分支targetNode 或者 移动到空白处 不会删除线
        if (
          link.data &&
          link.data.id &&
          sourceNode &&
          sourceNode.data &&
          (sourceNode.data.type === 'split' || sourceNode.data.type === 'trigger')
        ) {
          // console.log('0-如果是分流器和触发器 改变分支targetNode 或者 移动到空白处 不会删除线');
          const length = that.diagramObj.edgeDefinitionList.length;
          for (let i = 0; i < length; i++) {
            if (that.diagramObj.edgeDefinitionList[i].id === link.data.id) {
              if (sourceNode && targetNode) {
                link.data['targetNodeId'] = targetNode.data.id;
                delete link.data.x;
                delete link.data.y;
              } else {
                link.data.x = link.attributes.target.x;
                link.data.y = link.attributes.target.y;
                delete link.data['targetNodeId'];
              }
              that.diagramObj.edgeDefinitionList[i] = link.data;
              break;
            }
          }
          that.updatePipeLine();
          return;
        }
        if (sourceId && targetId) {
          // 如果已经有从该节点到结束节点的连线 则删除当前连线
          if (targetNode && targetNode.data && targetNode.data.type == 'end') {
            // console.log('2-如果已经有从该节点到结束节点的连线 则删除当前连线');
            let linkList = that.graph.getConnectedLinks(targetNode, { inbound: true });
            let length = linkList.length;
            let connectCount = 0; // 判断有几条线
            for (let i = 0; i < length; i++) {
              if (linkList[i].attributes.source.id === sourceNode.id) {
                connectCount++;
                if (connectCount > 1) {
                  that.removeFlag = true;
                  that.graph.removeCells([link]);
                  that.removeFlag = false;
                  break;
                }
              }
            }
            if (connectCount > 1) {
              return;
            }
          }
          if (link.data && link.data.id) {
            // console.log('3-如果是修改连线 修改传给后端数据的targetId');
            // 如果是修改连线 修改传给后端数据的targetId
            for (let i = 0; i < that.diagramObj.edgeDefinitionList.length; i++) {
              if (that.diagramObj.edgeDefinitionList[i].id == link.data.id) {
                that.diagramObj.edgeDefinitionList[i].targetNodeId = targetNode.data.id;
                break;
              }
            }
          } else {
            // console.log('4-如果是添加连线');
            // 如果是添加连线
            let edgeDefinition = {
              id: that.createNodeId(),
              pipelineDefinitionId: that.pipelineId,
              name: (link.data && link.data.name) || ''
            };
            edgeDefinition['sourceNodeId'] = sourceNode.data.id;
            edgeDefinition['targetNodeId'] = targetNode.data.id;
            if (!that.diagramObj.edgeDefinitionList) {
              that.diagramObj.edgeDefinitionList = [];
            }
            that.diagramObj.edgeDefinitionList.push(edgeDefinition);
            link.data = edgeDefinition;
          }
          that.updateSimple();
        } else {
          // console.log('99-!!!!!sourceId && targetId');
          if (
            link.data &&
            link.data.name &&
            sourceNode &&
            sourceNode.data &&
            (sourceNode.data.type == 'split' || sourceNode.data.type == 'trigger')
          ) {
            return;
          }
          that.removeFlag = true;
          that.graph.removeCells([link]);
          that.removeFlag = false;
        }
      }, 1000);
    });

    // 添加单元时
    that.graph.on('add', (cell: any) => {
      if (cell.isLink()) {
        if (that.linkSetTimeoutId[cell.id]) {
          clearTimeout(that.linkSetTimeoutId[cell.id]);
        }
        //防止点击节点右边output点 出现指向自己的线
        that.linkSetTimeoutId[cell.id] = setTimeout(function() {
          let sourceId = cell.attributes.source.id;
          let targetId = cell.attributes.target.id;
          if (sourceId === targetId) {
            that.removeFlag = true;
            that.graph.removeCells([cell]);
            that.removeFlag = false;
            return;
          }
          let sourceNode = that.graph.getCell(sourceId);
          let targetNode = that.graph.getCell(targetId);
          if ((!sourceNode || !targetNode) && sourceNode.data.type !== 'trigger' && sourceNode.data.type !== 'split') {
            that.removeFlag = true;
            that.graph.removeCells([cell]);
            that.removeFlag = false;
          }
        }, 1000);
      }
    });

    // 修改线的位置
    that.graph.on('change:vertices', (link: any) => {
      if (that.moveLinkSetTimeoutId) {
        clearTimeout(that.moveLinkSetTimeoutId);
        // console.log('clearTimeout-moveLinkSetTimeoutId');
      }
      that.moveLinkSetTimeoutId = setTimeout(() => {
        if (link.data) {
          for (let i = 0; i < that.diagramObj.edgeDefinitionList.length; i++) {
            if (that.diagramObj.edgeDefinitionList[i].id === link.data.id) {
              that.diagramObj.edgeDefinitionList[i]['vertices'] = cloneDeep(link.attributes.vertices);
              break;
            }
          }
          that.updatePipeLine();
        }
      }, 1000);
    });

    // 删除事件
    that.graph.on('remove', (e: any) => {
      if (e.isLink()) {
        if (e.data && e.data.id) {
          let flag = false;
          let node = that.graph.getCell(that.nodeMap[e.data.sourceNodeId]);
          let nodeData = node && node.data;
          let targetNode = that.graph.getCell(that.nodeMap[e.data.targetNodeId]);
          if (targetNode && that.relDeleteNodeId && that.relDeleteNodeId == targetNode.id) {
            // 判断是不是删除该线指向的目标节点导致指向该线被删除
            flag = true;
          }
          if (nodeData && (nodeData.type === 'trigger' || nodeData.type === 'split') && !that.removeFlag) {
            if (!flag) {
              that.graph.addCell(e);
              if (nodeData.type === 'split') {
                that.message.create('error', '请在分流器中修改分支数量');
              } else if (nodeData.type === 'trigger') {
                that.message.create('error', '请在触发器中修改分支数量');
              }
            } else {
              if (targetNode && targetNode.data) {
                // 将线指向原节点的位置
                delete e.attributes.target;
                e.attributes['target'] = {
                  x: targetNode.data.x,
                  y: targetNode.data.y
                };
                e.data.x = targetNode.data.x;
                e.data.y = targetNode.data.y;
                delete e.data.targetNodeId;
              }
              // that.noticeShow = true;
              that.graph.addCell(e);
            }
            return;
          }
          let i;
          for (i = 0; i < that.diagramObj.edgeDefinitionList.length; i++) {
            if (that.diagramObj.edgeDefinitionList[i].id === e.data.id) {
              break;
            }
          }
          that.diagramObj.edgeDefinitionList.splice(i, 1);

          if (!that.removeFlag) {
            that.updatePipeLine();
          }
        }
      }
    });
  }

  getPipelineDetail(type?: any) {
    const that = this;

    that.pipelineService.getCampaign(that.campaignId).subscribe((campaignData: any) => {
      if (campaignData.code === 200) {
        const campaignObj = campaignData.data;
        that.campaignStatus = campaignObj.status;
        that.campaignObj = campaignObj;

        that.business.checkEditByCampaign(that, campaignObj);
      }
      that.pipelineService.getPipeline(that.pipelineId).subscribe((response: any) => {
        if (response.code === 200) {
          const pipeline = response.data;

          that.pcs.startTime = new Date(pipeline.startTime);
          that.pcs.endTime = new Date(pipeline.endTime);
          that.pipelineObj = pipeline;

          if (pipeline && pipeline.diagram) {
            that.diagramObj = JSON.parse(pipeline.diagram);
          }
          // 读取全局规则数据
          that.pcs.globalRule = that.diagramObj;

          // 判断是否可以编辑
          that.business.checkEditByPipeline(that, pipeline);

          // 第一次创建时 添加入口组件
          if (that.diagramObj.nodeDefinitionList.length === 0) {
            that.diagramObj.nodeDefinitionList.push({
              id: that.createNodeId(),
              serial: that.guid(),
              pipelineDefinitionId: that.pipelineId,
              icon: '/aeplus-pro/assets/images/pipeline/component-entrance.svg',
              name: '入口',
              type: 'entrance',
              x: 122,
              y: 120,
              width: 52,
              height: 64,
              index: 0
            });

            that.diagramObj.pipelineId = that.pipelineId;
          }

          if (type !== 'debug') {
            that.business.renderGraph(that);
          } else {
            for (let i = 0; i < that.diagramObj.nodeDefinitionList.length; i++) {
              const obj = that.diagramObj.nodeDefinitionList[i];
              const tempNode = that.graph.getCell(that.nodeMap[obj.id]);
              if (tempNode) {
                tempNode.attr({
                  image: {
                    'xlink:href': obj.icon
                  }
                });
              }
            }
            for (let i = 0; i < that.diagramObj.edgeDefinitionList.length; i++) {
              const obj = that.diagramObj.edgeDefinitionList[i];
              const tempLink = that.graph.getCell(that.lineMap[obj.id]);
              if (tempLink) {
                tempLink.set('labels', [
                  {
                    position: 0.5,
                    attrs: {
                      text: {
                        text: obj.name
                      }
                    }
                  }
                ]);
              }
            }
          }

          if (
            that.pipelineObj.testStatus === 2 ||
            that.pipelineObj.testStatus === 3 ||
            that.pipelineObj.status === 5 ||
            that.pipelineObj.status === 7 ||
            that.pipelineObj.status === 8
          ) {
            that.business.getMonitorData(that);
          }
        }
      });
    });
  }

  // 显示全局规则
  showRule() {
    const that = this;
    that.updatePipeLine();

    that.showRightContent = '';
    that.pcs.nodeData = null;
    setTimeout(function() {
      that.showRightContent = 'rule';
    }, 1);
  }

  /**
   * 保存草稿
   */
  saveDraft() {
    const that = this;
    that.updatePipeLine('back');
  }

  /**
   * pipeline 数据更新
   */
  updatePipeLine(type?: string) {
    const that = this;

    if (!that.pcs.isPipelineEdit) {
      return;
    }

    that.pcs.beforeSaveOrCheck(that);
    that.hideDetail();

    that.saveDraftTrue(type);
  }

  updateSimple() {
    const that = this;

    // console.log('----updateSimple----');

    that.diagramObj['pipelineId'] = that.pipelineObj.id;
    that.diagramObj['campaignId'] = that.pipelineObj.campaignId;
    that.diagramObj['name'] = that.pipelineObj.name;
    that.diagramObj['status'] = that.pipelineObj.status;
    that.diagramObj['version'] = that.pipelineObj.version || '1.0.0';
    that.diagramObj['startTime'] = that.pipelineObj.startTime;
    that.diagramObj['endTime'] = that.pipelineObj.endTime;
    that.diagramObj['description'] = that.pipelineObj.description;
    that.diagramObj['tenantId'] = that.pipelineObj.tenantId;
    that.diagramObj['creator'] = that.pipelineObj.creator;
    that.diagramObj['createBy'] = that.pipelineObj.createBy;
    that.diagramObj['createTime'] = that.pipelineObj.createTime;
    that.diagramObj['updater'] = that.pipelineObj.updater;
    that.diagramObj['updateBy'] = that.pipelineObj.updateBy;
    that.diagramObj['updateTime'] = that.pipelineObj.updateTime;

    that.pipelineObj['diagram'] = JSON.stringify(that.diagramObj);

    that.saveDraftTrue();
  }

  saveDraftTrue(type?: any) {
    const that = this;
    that.pipelineService.saveDraft(that.pipelineObj).subscribe((result: any) => {
      if (result.code === 200) {
        that.isCheck = false;
        if (type === 'back') {
          that.goBack();
        }
        that.pipelineObj = result.data;
        that.pcs.startTime = new Date(result.data['startTime']);
        that.pcs.endTime = new Date(result.data['endTime']);
      }
    });
  }

  /**
   * 提交
   */
  submitPipeline() {
    const that = this;
    if (!that.isCheck) {
      that.message.create('error', '未通过校验不可以提交流程');
      return;
    }
    that.pipelineService.submitPipeline(that.pipelineId).subscribe((result: any) => {
      if (result.code === 200) {
        that.goBack();
      }
    });
  }

  /**
   * 删除算子
   */
  deleteNode() {
    const that = this;
    if (that.deleteNodeId) {
      that.modalService.confirm({
        nzTitle: '提示',
        nzContent: '当前操作不可逆，是否确定删除节点？',
        nzOnOk: () => {
          this.relDeleteNodeId = that.deleteNodeId; //确定删除组件赋予真正的删除id
          that.removeFlag = true; // 可以删除线
          const cell = that.graph.getCell(that.deleteNodeId);
          const index = cell.data && cell.data.index;
          that.diagramObj.nodeDefinitionList.splice(index, 1);
          that.pcs.nodeData = null;

          const links = that.graph.getConnectedLinks(cell, { outbound: true });
          if (links.length) {
            that.graph.removeCells(links);
          }
          that.removeFlag = false;
          for (let i = index; i < that.diagramObj.nodeDefinitionList.length; i++) {
            const obj = that.diagramObj.nodeDefinitionList[i];

            const node = that.graph.getCell(that.nodeMap[obj.id]);
            if (node && node.data) {
              node.data.index = node.data.index - 1;
            }
          }
          // 隐藏删除图层
          that.tipPanelStyleDisplay = 'none';
          that.top = '0';
          that.left = '0';
          that.graph.removeCells([cell]);
          that.updatePipeLine();
        }
      });
    } else {
      that.message.create('error', '系统错误，请刷新后重试');
    }
  }

  /**
   * 实时创建分流器活触发器生成连线
   * @param data
   *    type split/trigger 判断是分流器还是触发器
   *  lineType d/a/c 判断是增加线还是删除线还是修改
   *  id 线上id（自己创建的）
   *    index 第几条线
   *  name 线上显示的名称
   *  expression 线上保存的表达式
   *  deleteType all  占时只有all状态 lineType 为d时使用 删除该节点所有的线
   */
  changeLinks(data: any) {
    const that = this;
    if (!data || !data.id) {
      return;
    }
    const tempId = that.nodeMap[data.id];
    const node = that.graph.getCell(tempId);
    const links = that.graph.getConnectedLinks(node, { outbound: true });
    const linksLength = links.length;
    if (data.lineType === 'd') {
      // 删除连线
      if (!data.deleteType) {
        for (let i = 0; i < linksLength; i++) {
          // 数据类型不符，不能用===
          const linkIndex = links[i].data.index;
          if (linkIndex == data.index) {
            that.removeFlag = true;
            that.graph.removeCells([links[i]]);
            that.removeFlag = false;
          } else if (linkIndex != 10 && linkIndex > data.index && data.move_index != 'not') {
            links[i].data.index = linkIndex - 1;
          }
        }
      } else if (data.deleteType === 'all') {
        for (let i = 0; i < linksLength; i++) {
          that.removeFlag = true;
          that.graph.removeCells([links[i]]);
          that.removeFlag = false;
        }
      }
    } else if (data.lineType === 'a') {
      let tmpY = parseInt(node.data.y) - Math.min(parseInt(node.data.y) / 2, 100) + data.index * 40;
      for (let i = 0; i < links.length; i++) {
        const obj = links[i];
        if (obj.attributes.target && obj.attributes.target.y == tmpY) {
          tmpY += 20;
        }
      }

      // 添加连线
      const link = {
        id: that.createNodeId(),
        pipelineDefinitionId: that.pipelineId,
        sourceNodeId: data.id,
        x: parseInt(node.data.x) + 250,
        y: tmpY,
        index: data.index,
        name: data.name || '',
        expression: data.expression || ''
      };
      that.diagramObj.edgeDefinitionList.push(link);
      const linkNode = that.createLink(link, 'splitOrTrigger');
      linkNode.data = link;
      that.graph.addCells([linkNode]);
    } else if (data.lineType === 'c') {
      // 修改连线数据
      const length = that.diagramObj.edgeDefinitionList.length;
      for (let i = 0; i < length; i++) {
        if (data.id === that.diagramObj.edgeDefinitionList[i].id) {
          that.diagramObj.edgeDefinitionList[i].name = data.name || '';
          that.diagramObj.edgeDefinitionList[i].expression = data.expression || '';
        }
      }
      for (let i = 0; i < linksLength; i++) {
        if (+links[i].data.index === +data.index) {
          links[i].data.name = data.name || '';
          links[i].data.expression = data.expression || '';
          links[i].set('labels', [
            {
              position: 0.5,
              attrs: {
                text: {
                  text: data.name || ''
                }
              }
            }
          ]);
        }
      }
    }
  }

  // 随机生成节点ID或连线ID
  createNodeId() {
    let tempTime = Date.now() + '';
    for (let i = 0; i < 4; i++) {
      const temp = Math.floor(Math.random() * 10);
      tempTime = tempTime + temp;
    }
    return tempTime;
  }

  /**
   * 收起左边栏
   */
  packUp() {
    const that = this;
    that.isOperatorShow = !that.isOperatorShow;
  }

  /**
   * 拖入节点信息
   */
  drag(e: any, data: any) {
    const that = this;

    const nodeData = {
      icon: data.icon,
      id: data.id,
      name: data.name,
      type: data.type
    };

    e.dataTransfer.setData('dataInfo', JSON.stringify(nodeData));
  }

  /**
   * 允许拖入
   */
  dragover(e: any) {
    e.preventDefault();
  }

  /**
   * 拖入添加的节点
   */
  drop(e: any) {
    e.preventDefault();
    const that = this;

    if (!e.dataTransfer.getData('dataInfo')) {
      return;
    }

    const dataInfo: any = JSON.parse(e.dataTransfer.getData('dataInfo'));

    // 拖入入口组件，忽略
    if (dataInfo.type === 'entrance') {
      return;
    }

    // 拖入结束组件，若已有，忽略
    if (dataInfo.type === 'end') {
      for (let i = 0; i < that.diagramObj.nodeDefinitionList.length; i++) {
        const obj = that.diagramObj.nodeDefinitionList[i];
        if (obj.type === 'end') {
          return;
        }
      }
    }

    dataInfo.x = that.utiles.floatDiv(
      parseInt(e.offsetX) - that.utiles.floatMul(that.orignX, that.scaleX),
      that.scaleX
    );
    dataInfo.y = that.utiles.floatDiv(
      parseInt(e.offsetY) - that.utiles.floatMul(that.orignY, that.scaleY),
      that.scaleY
    );

    const nodeInfo = {
      X: dataInfo.x,
      Y: dataInfo.y,
      name: dataInfo.name,
      icon: dataInfo.icon
    };
    const model: any = that.initOperatorModel(dataInfo.type);
    const node: any = that.createOperator(model, nodeInfo);

    node.data = dataInfo;
    node.data.name = null;
    node.data['index'] = that.diagramObj.nodeDefinitionList.length;
    node.data['id'] = that.createNodeId();
    node.data['serial'] = that.guid();
    node.data['hourMeterType'] = '1';
    that.nodeMap[node.data.id] = node.id;

    const nodeData = JSON.parse(JSON.stringify(node.data));
    delete nodeData.index;
    that.diagramObj.nodeDefinitionList.push(nodeData);

    // 保存旧的节点信息
    that.updatePipeLine();

    if (node.data.type === 'trigger') {
      node.data.eventList = [
        {
          index: 0,
          name: null,
          id: 1,
          code: null,
          eventName: null
        }
      ];
    }

    that.showRightContent = '';
    that.pcs.nodeData = node.data;
    setTimeout(function() {
      that.showRightContent = node.data['type'];
    }, 1);

    that.graph.addCell(node);
  }

  /**
   * 校验
   */
  checkPipeline() {
    const that = this;
    that.pcs.beforeSaveOrCheck(that);
    that.hideDetail();

    that.pipelineService.saveDraft(that.pipelineObj).subscribe((result: any) => {
      if (result.code === 200) {
        that.pipelineObj = result.data;
        that.pcs.startTime = new Date(result.data['startTime']);
        that.pcs.endTime = new Date(result.data['endTime']);
      }
    });

    that.pipelineService.check(that.pipelineObj).subscribe((response: any) => {
      if (response.code === 200) {
        const errorList = response.data;

        if (errorList.length > 0) {
          that.isCheck = false;
          const newErrNodeList = [];
          for (let i = 0; i < errorList.length; i++) {
            const obj = errorList[i];
            newErrNodeList.push(obj.nodeId);

            let errMessage = '';
            obj.errMsg.forEach((data: string, j: number) => {
              if (j === 0) {
                errMessage += `${data}`;
              } else {
                errMessage += `\n${data}`;
              }
            });
            that.updateNodeLabel(obj.nodeId, errMessage);
          }

          if (that.errNodeList.length > 0) {
            let nodeList = difference(that.errNodeList, newErrNodeList);
            for (let i = 0; i < nodeList.length; i++) {
              that.updateNodeLabel(nodeList[i]);
            }
          }
          that.errNodeList = newErrNodeList;
        } else {
          for (let i = 0; i < that.errNodeList.length; i++) {
            that.updateNodeLabel(that.errNodeList[i]);
          }
          that.message.create('info', '校验通过');
          that.isCheck = true;
        }
      }
    });
  }

  updateNodeLabel(nodeId: any, errMessage?: any) {
    const that = this;
    const node = that.graph.getCell(that.nodeMap[nodeId]);
    if (!node) {
      return;
    }

    if (errMessage) {
      node.attr({
        //                '.rect': {
        //                    display: 'inline-block'
        //                },
        image: {
          'xlink:href': that.pcs.redIconMap[node.data.type]
        },
        '.label': {
          text: errMessage,
          fill: '#DF5E63'
        }
      });
      node.data.isErrorState = true;
    } else {
      node.attr({
        //                '.rect': {
        //                    display: 'none'
        //                },
        image: {
          'xlink:href': node.data.icon
        },
        '.label': {
          text: (node.data && node.data.name) || that.pcs.typeNameMap[node.data.type],
          fill: '#000'
        }
      });
      node.data.isErrorState = false;
    }
  }

  /**
   * 隐藏右边的content
   */
  hideDetail() {
    const that = this;

    that.showRightContent = '';
    that.pcs.nodeData = null;

    that.pcs.nodeLinks = [];
  }

  // 新建节点
  createOperator(operatorModel: any, operatorInfo: any) {
    const operator = new operatorModel({
      position: {
        x: parseInt(operatorInfo.X),
        y: parseInt(operatorInfo.Y)
      },
      attrs: {
        '.top': {
          text: ''
        },
        '.label': {
          text: operatorInfo.name || ''
        },
        image: {
          'xlink:href': operatorInfo.icon
        }
      }
    });
    return operator;
  }

  // 默认配置节点信息
  initOperatorModel(type?: string) {
    const that = this;
    const json: any = {
      type: 'devs.MyImageModel',
      size: {
        width: 52,
        height: 64
      },
      attrs: {
        '.label': {
          'text-anchor': 'middle',
          'font-size': 12,
          y: 60
        },
        '.label.top': {
          y: -13
        },
        image: {
          // 'xlink:href': 'http:// 127.0.0.1:9999/public/images/component-entrance.svg',
          x: 4,
          width: 44,
          height: 44
        },
        rect: {
          'fill-opacity': 0,
          'stroke-width': 2,
          width: 50,
          height: 44
        },
        '.rect': {
          stroke: '#EA5359',
          display: 'none'
        }
      },
      ports: {
        groups: {
          inPorts: {
            position: {
              name: 'left'
            },
            attrs: {
              circle: {
                r: 4,
                stroke: '#5697f1',
                fill: '#5697f1',
                // 'stroke-width': 5,
                // 无法拖出线
                magnet: 'passive'
              }
            }
          },
          outPorts: {
            position: {
              name: 'right'
            },
            attrs: {
              circle: {
                r: 4,
                stroke: '#5697f1',
                'stroke-width': 2,
                magnet: true
              }
            }
          }
        }
      }
    };
    if (type === 'entrance') {
      json.ports['items'] = [
        {
          id: 'out',
          group: 'outPorts'
        }
      ];
    } else if (type === 'end') {
      json.ports['items'] = [
        {
          id: 'in',
          group: 'inPorts'
        }
      ];
    } else if (type === 'trigger' || type === 'split') {
      json.ports.groups.outPorts.attrs.circle.magnet = 'passive';
      json.ports.groups.outPorts.attrs.circle['fill'] = '#5697f1';
      json.ports['items'] = [
        {
          id: 'in',
          group: 'inPorts'
        },
        {
          id: 'out',
          group: 'outPorts'
        }
      ];
    } else {
      json.ports['items'] = [
        {
          id: 'in',
          group: 'inPorts'
        },
        {
          id: 'out',
          group: 'outPorts'
        }
      ];
    }
    if (!that.pcs.isPipelineEdit) {
      json.ports.groups.outPorts.attrs.circle.magnet = 'passive';
    }
    const model = joint.shapes.basic.Rect.extend({
      markup:
        '<g class="rotatable"><text class="label top"/><image /><text class="label"/><rect class="rect"></rect></g>',
      defaults: defaultsDeep(json, joint.shapes.devs.Model.prototype.defaults)
      // defaults: json
    });
    return model;
  }

  // 生成线
  createLink(linkData: any, type?: string) {
    const that = this;
    const tempLink = {
      attrs: {
        '.connection': {
          stroke: '#C3CBD6',
          'stroke-width': 1
        },
        // tslint:disable-next-line
        // '.marker-source': { fill: '#C3CBD6', stroke: '#C3CBD6', d: 'M 10 0 L 0 5 L 10 10 z', transform: 'scale(0.001)' },
        '.marker-target': { fill: '#C3CBD6', stroke: '#C3CBD6', d: 'M 10 0 L 0 5 L 10 10 z' }
      },
      labelPosition: 'c',
      router: { name: 'manhattan' },
      connector: { name: 'normal' }
    };
    if (linkData.sourceNodeId) {
      tempLink['source'] = { id: that.nodeMap[linkData.sourceNodeId], port: 'out' };
    }
    if (linkData.targetNodeId) {
      tempLink['target'] = { id: that.nodeMap[linkData.targetNodeId], port: 'in' };
    } else {
      tempLink['target'] = { x: linkData.x, y: linkData.y };
    }
    if (type) {
      tempLink.router.name = 'normal';
    }
    if (linkData.vertices && linkData.vertices.length !== 0) {
      tempLink['vertices'] = cloneDeep(linkData.vertices);
    }
    tempLink['labels'] = [
      {
        position: 0.5,
        attrs: {
          text: {
            text: linkData.name || ''
          }
        }
      }
    ];
    const link = new joint.dia.Link(tempLink);
    link.data = linkData;
    return link;
  }

  // 鼠标移到删除浮层div上
  mouseenter() {
    let that = this;
    that.tipPanelStyleDisplay = 'block';
  }

  // 鼠标离开删除浮层div
  mouseleave() {
    let that = this;
    that.tipPanelStyleDisplay = 'none';
  }

  // 返回详情页面
  goBack() {
    history.back();
  }

  // 显示投放报告
  showReport(segment: any) {
    let reportNodeData = this.reportNodeData;
    let channelType = reportNodeData.type;

    let pipelineId = this.pipelineId;
    let nodeId = reportNodeData.id;

    let _that = this;
    this.pipelineService.getSegmentByPipelineId(pipelineId, nodeId).subscribe(response => {
      if (response.code === 200) {
        if (response.data) {
          _that.reportObj = {
            campaignId: _that.campaignId,
            segmentId: response.data.id,
            name: response.data.name,
            right: true
          };

          let contentTmp = null;
          if (channelType === 'push') {
            contentTmp = _that.report_push;
          } else if (channelType === 'shortMessage') {
            contentTmp = _that.report_sms;
          } else if (channelType === 'mail') {
            contentTmp = _that.report_email;
          }

          _that.modalService.create({
            nzTitle: '投放报告',
            nzContent: contentTmp,
            nzCancelText: null,
            nzOkText: null,
            nzWidth: '80%',
            nzMask: true,
            nzMaskClosable: false,
            nzFooter: null,
            nzBodyStyle: {
              background: '#eef0f3',
              padding: '0px 0px 16px 0px'
            }
          });
        } else {
          this.message.create('error', '没有找到投放信息');
        }
      }
    });
  }

  // 显示画像
  showPortrayal() {
    let reportNodeData = this.reportNodeData;
    this.reportObj.crowdIdInput = reportNodeData.geneCrowdId;
    let contentTmp: any = this.report_insights;
    this.modalRef = this.modalService.create({
      nzTitle: '洞察',
      nzContent: contentTmp,
      nzCancelText: null,
      nzOkText: null,
      nzWidth: '80%',
      nzMask: true,
      nzMaskClosable: false
    });
  }

  // 关闭弹窗（点击画像页面的导出，关闭弹窗）
  closeModal(event: any) {
    this.modalRef.close();
  }

  ngOnDestroy() {
    document.removeEventListener('click', () => {}, false);
    this.subscript.unsubscribe(); // 取消订阅
  }

  addOrigin() {
    let that = this;
    that.scaleX += 0.1;
    that.scaleY += 0.1;
    let tempx = -((50 / 2 - (50 * that.scaleX) / 2) / that.scaleX);
    let tempy = -((50 / 2 - (50 * that.scaleY) / 2) / that.scaleY);
    that.transformStyle = `scale(${that.scaleX}, ${that.scaleY}) translate(${tempx}px, ${tempy}px)`;
    that.paper.scale(that.scaleX, that.scaleY);
  }

  subtractOrigin() {
    let that = this;
    if (that.scaleX <= 0.7) {
      // 防止缩小小于0.7 小于0.7后位置计算不准
      return;
    }
    that.scaleX = +that.utiles.floatSub(that.scaleX, 0.1);
    that.scaleY = +that.utiles.floatSub(that.scaleY, 0.1);
    let tempx = (50 * (that.scaleX - 1)) / 2;
    let tempy = (50 * (that.scaleY - 1)) / 2;
    that.transformStyle = `scale(${that.scaleX}, ${that.scaleY}) translate(${tempx}px, ${tempy}px)`;
    that.paper.scale(that.scaleX, that.scaleY);
  }

  resetOrigin() {
    let that = this;
    that.orignX = 0;
    that.orignY = 0;
    that.scaleX = 1;
    that.scaleY = 1;
    that.paper.setOrigin(that.orignX, that.orignY);
    that.paper.scale(that.scaleX, that.scaleY);
    that.transformStyle = 'scale(1)';
  }
}
