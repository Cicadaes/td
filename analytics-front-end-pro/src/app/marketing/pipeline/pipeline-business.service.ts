import {Injectable} from '@angular/core';
import * as joint from 'jointjs';
import * as _ from 'lodash';
import {differenceInDays, differenceInCalendarDays} from 'date-fns';

@Injectable()
export class PipelineBusinessService {

    initPaper(that: any) {
        const defaultPaper: any = {
            el: document.getElementById('pipeline'),
            width: '100%',
            height: '100%',
            model: that.graph,
            gridSize: 1,
            clickThreshold: 1,// 解决部分window电脑点击算子没反应的问题
            // linkPinning: false,
            // interactive: false, // 无法拖动
            interactive: function () {
                return that.pcs.isPipelineEdit;
            },
            validateConnection: function (cellViewS: any, magnetS: any, cellViewT: any, magnetT: any, end: any, linkView: any) {
                // Prevent linking from input ports.
                // if (magnetS && magnetS.getAttribute('port-group') === 'inPorts') return false;
                // Prevent linking from output ports to input ports within one element.
                if (cellViewS === cellViewT) {
                    return false
                }
                ;
                // Prevent linking to input ports.
                return magnetT && magnetT.getAttribute('port-group') === 'inPorts';
            },
            defaultLink: new joint.dia.Link({
                'router': {
                    name: 'manhattan',
                },
                'connector': {
                    name: 'normal',
                },
                attrs: {
                    '.marker-target': {d: 'M 10 0 L 0 5 L 10 10 z', stroke: '#C3CBD6', fill: '#C3CBD6'},
                    '.connection': {
                        'stroke': '#C3CBD6',
                        'stroke-width': 1
                    }
                }
            }),
        };

        const paper = new joint.dia.Paper(defaultPaper);
        return paper;
    }

    getMonitorData(that: any) {
        that.pipelineService.getMonitorData(that.pipelineId).subscribe((data: any) => {
            if (data && data.code === 200) {
                const monitorData = data.data;

                for (let i = 0; i < monitorData.length; i++) {
                    const obj = monitorData[i];
                    if (that.nodeMap[obj.pipelineEdgeId]) {
                        const tempNode = that.graph.getCell(that.nodeMap[obj.pipelineEdgeId]);
                        if (that.pipelineObj.testStatus === 2 || that.pipelineObj.testStatus === 3) {
                            tempNode.attr({
//                                '.top': {
//                                    text: obj.metricValue
//                                },
                                image: {
                                    'xlink:href': that.pcs.greenIconMap[tempNode.data.type],
                                }
                            })
                        }
                    } else if (that.lineMap[obj.pipelineEdgeId]) {
                        const tempLink = that.graph.getCell(that.lineMap[obj.pipelineEdgeId]);
                        const sourceNodeObj = that.graph.getCell(tempLink.attributes.source.id);

                        let value = that.toThousandStr(obj.metricValue);
                        let text;
                        if (sourceNodeObj.data.type === 'split' || sourceNodeObj.data.type === 'trigger') {
                            text = (`${tempLink.data.name}  ` || '') + `(${value})`
                        } else {
                            text = value
                        }
                        tempLink.set('labels', [{
                            position: 0.5,
                            attrs: {
                                text: {
                                    text: text
                                }
                            }
                        }]);
                    }
                }
            }
        });
    }

    renderGraph(that: any) {

        const nodeList: any[] = [];
        const noRouteNode: any = []; // 用于存放
        for (let i = 0; i < that.diagramObj.nodeDefinitionList.length; i++) {
            const obj = that.diagramObj.nodeDefinitionList[i];
            const nodeModel = that.initOperatorModel(obj.type);

            // 将分流器和触发器的nodeId存放起来
            if (obj.type === 'split' || obj.type === 'trigger') {
                noRouteNode.push(obj.id);
            }

            const node = that.createOperator(nodeModel, {
                X: parseInt(obj.x),
                Y: parseInt(obj.y),
                name: obj.name || that.pcs.typeNameMap[obj.type],
                icon: obj.icon
            });
            const tempData = _.cloneDeep(obj);
            tempData['index'] = i;
            node.data = tempData;
            that.nodeMap[tempData.id] = node.id;
            nodeList.push(node);
        }

        that.diagramObj.edgeDefinitionList.forEach((data: any) => {
            let link;
            if (noRouteNode.indexOf(data.sourceNodeId) !== -1) {
                link = that.createLink(data, 'splitOrTrigger');
            } else {
                link = that.createLink(data);
            }
            link.data = data;
            that.lineMap[data.id] = link.id;
            nodeList.push(link);
        });

//        that.graph.clear();
        that.graph.addCells(nodeList);

    }

    checkEditByCampaign(that: any, campaignObj: any) {
        const today = new Date();
        let time;
        const time1 = new Date(campaignObj.startTime); // .getTime() + 86400000
        const time2 = new Date(campaignObj.endTime);
        const a = differenceInDays(today, time1);
        if (a > 0 && a / 1 > 0) {
            time = new Date(today.getTime() + 86400000);
        } else {
            time = new Date(time1.getTime() + 86400000);
        }

        that.pcs.isPipelineEdit = true;
        if (that.campaignStatus === 3) {
            that.pcs.isPipelineEdit = false;
        }
        if (time > time2) {
            that.pcs.isPipelineEdit = false;
        }
    }

    checkEditByPipeline(that: any, pipeline: any) {
        if (pipeline.testStatus === 1 || pipeline.testStatus === 2 || pipeline.testStatus === 3) {
            that.pcs.isPipelineEdit = false;
        }

        if (that.pcs.isPipelineEdit) {
            if (pipeline.status === 1 || pipeline.status === 3 || pipeline.status === 6) {
                that.pcs.isPipelineEdit = true;
            } else {
                that.pcs.isPipelineEdit = false;
            }
            if (pipeline.endTime < new Date()) {
                that.pcs.isPipelineEdit = false;
            }
        }
    }

}