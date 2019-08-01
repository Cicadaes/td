import {Component, OnInit, OnChanges} from '@angular/core';
import {CommonService} from '../../../common/services/common.service';
import {MarketingManageService} from '../marketing-manage.service';
import {NzNotificationService} from 'ng-zorro-antd';

@Component({
    selector: 'app-ascribe-config',
    templateUrl: './ascribe-config.component.html',
    styleUrls: ['./ascribe-config.component.less']
})
export class AscribeConfigComponent implements OnInit {

    productId: any;                         // 产品ID
    stepList: any = [];                     // 步骤二的列表
    stepAll: any = [];                      // 步骤一的列表
    object: any = {};                       // 用于判断选择的步骤有没有重复
    editFlag: boolean;                      // 是否处于编辑状态
    layerYvalueStart: any;                  // 开始拖动的位置
    _item: any;                             // 拖动的当前元素
    _index: any;                            // 拖动的当前元素索引
    _data: any;                             // 查询出的配置结果
    constructor(private commonservice: CommonService,
                private marketingManageService: MarketingManageService,
                private notification: NzNotificationService) {
    }

    ngOnInit() {
        if (this.commonservice.productId) {
            this.productId = Number(this.commonservice.productId);
        }
        this.getAscribe({productId: this.productId}, 1);
    }

    // 查询
    getAscribe(obj: any, init?: any) {
        this.stepAll = [
            {
                name: '首次互动归因',
                indexId: 1,
                desc: '将用户第一次收到的投放作为归因对象',
                checked: false
            },
            {
                name: '末次互动归因',
                indexId: 2,
                desc: '将导致用户转化的直接来源作为归因对象，即与转化行为在同一个session下的投放行为',
                checked: false
            },
            {
                name: '末次非直接点击归因',
                indexId: 3,
                desc: '从用户转化时间点回溯选择时间距离最近的一次投放作为归因对象',
                checked: false
            },
        ];
        this.marketingManageService.getAscribe(obj).subscribe((response) => {
            if (response.code === 200) {
                if (init && response.data.data.length < 1) {
                    this.editFlag = true;
                } else {
                    this.editFlag = false;
                }
                this.stepList = [];
                this._data = response.data.data;
                this.disposeData(response.data.data);
            } else {
                this.notification.create('warning', '错误提示', response.message);
            }
        });
    }

    // 处理回填数据
    disposeData(data: any) {
        for (let i = 0; i < data.length; i++) {
            const one = data[i];
            this.stepAll.map((item) => {
                if (item.name === one.attributeKey) {
                    if (data.length > 0) {
                        item['id'] = one.id;
                    }
                    // item.indexId = Number(one.attributeOrder);
                    item.checked = true;
                }
            });
        }
        for (let i = 0; i < data.length; i++) {
            const one = data[i];
            const obj = {
                name: one.attributeKey,
                indexId: Number(one.attributeOrder),
                checked: true
            };
            if (data.length > 0) {
                obj['id'] = one.id;
            }
            this.object[obj.name] = 1;
            this.stepList.push(obj);
            this.stepList.sort(this.compare('indexId'));
        }
    }

    // 按照步骤排序
    compare(property: any) {
        return function (a, b) {
            const value1 = a[property];
            const value2 = b[property];
            return value1 - value2;
        };
    }

    // 选择某个归因模型
    checkOne(item: any) {
        const that = this;
        if (this.stepList.length < 3) {
            that.stepAll.map((one) => {
                if (one.checked) {
                    if (!that.object[one.name]) {
                        that.object[one.name] = 1;
                        that.stepList.push(one);
                    }
                }
            });
        }

        if (!item.checked) {
            that.stepList = that.stepList.filter((el) => {
                if (that.object.hasOwnProperty([item.name])) {
                    delete that.object[item.name];
                }
                return el.name !== item.name;
            });
        }
    }

    // edit
    edit() {
        this.editFlag = true;
    }

    // save
    save() {
        const arr = [];
        this.stepList.map((one, index) => {
            const obj = {
                attributeKey: one.name,
                attributeOrder: (index + 1).toString(),
                productId: this.productId,
            };
            if (this._data.length > 0) {
                if (one.id) {
                    obj['id'] = one.id;
                }
            }
            arr.push(obj);
        });
        if (this._data.length < 1) { // 新建
            this.marketingManageService.insertAscribe(arr).subscribe((response) => {
                if (response.code === 200) {
                    this.notification.create('success', '提示信息', '保存成功');
                    this.getAscribe({productId: this.productId});
                } else {
                    this.notification.create('warning', '错误提示', response.message);
                }
            });
        } else { // 编辑
            this.marketingManageService.updateAscribe(arr).subscribe((response) => {
                if (response.code === 200) {
                    this.notification.create('success', '提示信息', '修改成功');
                    this.getAscribe({productId: this.productId});
                } else {
                    this.notification.create('warning', '错误提示', response.message);
                }
            });
        }
    }

    // cancel
    cancel() {
        this.getAscribe({productId: this.productId});
    }

    drag(event: any, item: any, index: any) {
        this.layerYvalueStart = event.layerY;
        this._item = item;
        this._index = index;
        if (!this.editFlag) {
            event.preventDefault(); // 会阻止drag的后续事件，相当不再执行拖拽
        }
    }

    // 允许拖入
    allowDrop(e: any) {
        e.preventDefault();
    }

    // 拖入添加的节点
    drop(e: any) {
        e.preventDefault();
//        const that = this;
        const layerYvalueEnd = e.layerY;
        const layer = layerYvalueEnd - this.layerYvalueStart;
        const layer2 = this.layerYvalueStart - layerYvalueEnd;
        const value = Math.abs(layer);
        const judge = Math.round(value / 2);

        if (layer <= 50 && layer > 0) {
            if (this._index >= 2) {
                return;
            }
            if (judge > 13 && judge <= 25) {
                this.stepList = this.swapItems(this.stepList, this._index, this._index + 1);
            }
        } else if (layer > 50 && layer <= 100) {
            if (this._index >= 3 || this.stepList.length - 1 <= this._index) {
                return;
            }
            const a = Math.round(layer - 50);
            if (a > 13 && a < 25) {
                // if (this.stepList.length < 3) {
                //     this.stepList = this.swapItems(this.stepList, this._index, this._index + 1);
                // } else {
                this.stepList = this.swapItems(this.stepList, this._index, this._index + 1);
                //     this.stepList = this.swapItems(this.stepList, this._index + 1, this._index + 2);
                // }
            } else {
                if (this.stepList.length < 3) {
                    this.stepList = this.swapItems(this.stepList, this._index, this._index + 1);
                } else {
                    if(this._index == this.stepList.length-2){
                        this.stepList = this.swapItems(this.stepList, this._index, this._index + 1);
                    }else {
                        this.stepList = this.swapItems(this.stepList, this._index, this._index + 1);
                        this.stepList = this.swapItems(this.stepList, this._index + 1, this._index + 2);
                    }
                }
                // this.stepList = this.swapItems(this.stepList, this._index, this._index + 1);
            }
        } else if (layer > 100 && layer <= 150) {
            if (this._index >= 3 || this.stepList.length - 1 <= this._index) {
                return;
            }
            if (this.stepList.length < 3) {
                this.stepList = this.swapItems(this.stepList, this._index, this._index + 1);
            } else {
                if(this._index == this.stepList.length-2){
                    this.stepList = this.swapItems(this.stepList, this._index, this._index + 1);
                }else {
                    this.stepList = this.swapItems(this.stepList, this._index, this._index + 1);
                    this.stepList = this.swapItems(this.stepList, this._index + 1, this._index + 2);
                }
            }
        } else {
            if (layer2 <= 50 && layer2 > 0) {
                if (this._index === 0) {
                    return;
                }

                if (layer2 > 25 && layer2 <= 50) {
                    this.stepList = this.swapItems(this.stepList, this._index, this._index - 1);
                }
            } else if (layer2 > 50) {
                const a = Math.round(layer2 - 50);
                if (a > 25) {
                    this.stepList = this.swapItems(this.stepList, this._index, this._index - 1);
                    this.stepList = this.swapItems(this.stepList, this._index - 1, this._index - 2);
                } else {
                    this.stepList = this.swapItems(this.stepList, this._index, this._index - 1);
                }
            }
        }
    }

    swapItems(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
    }

}
