import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Communication, EventEmitter, EventType, DataStore } from "cosmos-td-sdk";
import { CosmosChartComponent } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.component';

import { GridGraph } from './grid.graph';


@Component({
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.less']
})
export class GridComponent extends Communication implements OnInit, OnDestroy {

    @ViewChild('cmchart') cmchart: CosmosChartComponent;

    public option: GridGraph = new GridGraph('','');
    public style:any = this.option.style;
    // public data:any = this.option.data;
    private dataObj: any = {
        data: {},
        style: {}
    };
    data:any = [];
    defaultData = [
        {
          key     : 1,
          name    : 'John Brown sr.',
          age     : 60,
          address : 'New York No. 1 Lake Park',
          children: [ {
            key1    : 11,
            name1   : 'John Brown',
            age1   : 42,
            // address: 'New York No. 2 Lake Park',
          }, {
            key     : 12,
            name    : 'John Brown jr.',
            age     : 30,
            // address : 'New York No. 3 Lake Park',
            
          }, {
            key     : 13,
            name    : 'Jim Green sr.',
            age     : 72,
            // address : 'London No. 1 Lake Park',
            
          } ],
        },
        {
          key    : 2,
          name   : 'Joe Black',
          age    : 32,
          address: 'Sidney No. 1 Lake Park',
        }
      ];
      expandDataCache = {};
      thead:any = [];
    
      constructor() {
        super();
    }

    ngOnInit() {
       
    }

    collapse(array:any, data:any, $event:any) {
        if ($event === false) {
          if (data.children) {
            data.children.forEach((d:any) => {
              const target = array.find((a:any) => a.key === d.key);
              target.expand = false;
              this.collapse(array, target, false);
            });
          } else {
            return;
          }
        }
      }
    
      convertTreeToList(root:any) {
        const stack = [], array:any = [], hashMap = {};
        stack.push({ ...root, level: 0, expand: false });
    
        while (stack.length !== 0) {
          const node = stack.pop();
          this.visitNode(node, hashMap, array);
          if (node.children) {
            for (let i = node.children.length - 1; i >= 0; i--) {
              stack.push({ ...node.children[ i ], level: node.level + 1, expand: false, parent: node });
            }
          }
        }
    
        return array;
      }
    
      visitNode(node:any, hashMap:any, array:any) {
        if (!hashMap[ node.key ]) {
          hashMap[ node.key ] = true;
          array.push(node);
        }
      }

    public onDataChange(scope: string, data: any) {
        // 这里有个巨坑，暂时不解释
        // 创建一个新实例覆盖触发变更检测
        
        if(data && data.length > 0){
          this.dataObj.data = data;
          this.option = new GridGraph(this.dataObj, scope)
          this.data = this.option.data;
        }else{
          this.data = this.defaultData;
         
        }
        this.thead = [];
        for(let key in this.data[0]){
          this.thead.push(key);
        }

        console.log('表头', this.thead)
        console.log(this.data)
        this.data.forEach((item:any) => {
          this.expandDataCache[ item.key ] = this.convertTreeToList(item);
        });
        
    }

    public onStyleChange(scope: string, data: any) {
        this.dataObj.style = data;
        this.option = this.dataObj;
        this.style = this.option.style;
        console.log(this.style)
    }

    public onSizeChange() {
        this.cmchart && this.cmchart.echarts && this.cmchart.echarts.resize()
    }

    public onVisualArea(scope: string, data?:any) {
        EventEmitter.trigger(EventType.VISUALAREAINIT, { scope: scope,componentFilter:data });
    }
    ngOnDestroy() {

    }

}
