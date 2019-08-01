import {Component, Input} from '@angular/core';
import {DialogData, DialogConfirm} from "../../common/dialog/dialog_data.model";
import {DatasourceCommunicationService} from "../../report-service/datasource.communication.service";
import {DatacauseCommunicationService} from "../../report-service/datacause.service";
import {DialogCommunicationService} from "../../report-service/dialog.communication.service";
import {TreeNode} from 'primeng/primeng'

@Component({
    selector: 'report-dialog-sql',
    templateUrl: 'report-dialog-sql.component.html',
    styles: [`
        .sql_sqlSyntax{
            padding: 20px 0;            
        }
        :host /deep/ .ui-tree .ui-tree-container{
            height: 300px;
        }
        :host /deep/ .ui-tree .ui-treenode-leaf-icon{
            display: none;
        }
        :host /deep/ .ui-tree.ui-widget.ui-widget-content.ui-corner-all.ui-tree-selectable{
            width: 100%;
        }
        :host /deep/ .ui-tree .ui-treenode .ui-treenode-content .ui-treenode-label.ui-state-highlight{
            background: transparent;
            color: #5697f1;
        }
        :host /deep/ .ui-tree .ui-treenode .ui-treenode-content .ui-treenode-label.ui-state-highlight a.sql_selected{
            color: #5697f1;
            font-weight: bold;
        }
        :host /deep/ .ui-tree.ui-tree-selectable .ui-treenode-content{
            height: 24px;
        }
        :host /deep/ .ui-tree .ui-treenode .ui-treenode-content .ui-tree-toggler{
            width:30px !important;
        }
        .errTip{
            color:#f00;
            display:inline-block;
            float:left;
        } 
        .confirm_report{
            background:#ccc !important;
        }
    `]
})
export class ReportDialogSqlComponent {
    private addObj: any = {};
    private saveObj: any = {};
    private datasourceBoolean: boolean = false;
    private dataId: number;
    private dataName: string = '';
    private selectNodeLabel: string = '';
    private sqlCubeList: Array<any> = [];
    private selectedFiles: TreeNode;
    private fileSelected: TreeNode[]
    private nodeLabelShow:boolean=false;
    private fileFiltered: TreeNode[] = [{
        "label": "",
        "expandedIcon": "fa-folder-open",
        "collapsedIcon": "fa-folder-open",
        "expanded": null,
        "children": []
    }];
    private syntaxData:any = null;

    constructor(private communication: DatasourceCommunicationService,
                private datacauseCommunicationService: DatacauseCommunicationService,
                private dialogCommunicationService: DialogCommunicationService) {
        this.datacauseCommunicationService.missionShowGetSqlSyntax$.subscribe((data: any) => {
            this.datasourceBoolean = true;
            this.dataId = data.id;
            this.dataName = data.datasourceName;
            console.log(this.dataName)
            this.fileFiltered[0].children = [];
            this.getSqlSyntax();
            this.getCubeList();
            this.fileFiltered[0].label = this.dataName;
            this.selectedFiles = this.fileFiltered[0];
            this.selectedFiles.expanded = true;
        })

        this.datacauseCommunicationService.missionHideAllLayer$.subscribe((data: any) => {
            this.datasourceBoolean = false;
        })

        this.datacauseCommunicationService.missionHidePreview$.subscribe((data: any) => {
            this.datasourceBoolean = true;
        })
    }

    getSqlSyntax() {
        this.communication.querysqlsyntax(this.dataId).then((res: any) => {
            let sqlSyntaxList: Array<any> = [];
            for(let item of res.data){
                sqlSyntaxList.push({
                    "label" : item,
                    "icon": "fa-file-word-o"
                })
            }
            this.fileFiltered[0].children.push({
                "label": "视图",
                "expandedIcon": "fa-folder-open",
                "collapsedIcon": "fa-folder",
                "children": sqlSyntaxList,
                "expanded": null
            })
        }).catch(err => this.dialogCommunicationService.addMessage({
            severity: 'error',
            summary: '请求失败',
            detail: err._body
        }))
    }

    // 获取cube列表
    getCubeList() {
        this.communication.querycube(this.dataId).then((res: any) => {
            let sqlCubeList: Array<any> = [];
            for(let item of res.data){
                sqlCubeList.push({
                    "label" : item,
                    "icon": "fa-file-word-o"
                })
            }
            this.fileFiltered[0].children.push({
                "label": "表",
                "expandedIcon": "fa-folder-open",
                "collapsedIcon": "fa-folder",
                "children": sqlCubeList,
                "expanded": null
            })
        }).catch(err => this.dialogCommunicationService.addMessage({
            severity: 'error',
            summary: '请求失败',
            detail: err._body
        }))
    }

    nodeSelect(node:any){  
         if(node.label=="表"||node.label=="视图"|| node.label==this.dataName){      
             this.nodeLabelShow=true;
              return false;
         }else{
            this.selectNodeLabel = node.label;
            this.nodeLabelShow=false;
         }
       
       
    }

    cancel() {
        this.datasourceBoolean = false;
        this.datacauseCommunicationService.addConnections({syntaxName: '',id: -1});
    }

    confirm(id:any){
        this.addObj.id = this.dataId;
        this.addObj.tableName = this.selectNodeLabel;
        this.communication.queryconnections(this.addObj).then((res:any) => {
            if (res.success == true) {
                this.datasourceBoolean = false;
                this.addObj =  {};
                this.syntaxData = res.data;
                if(id == 0){
                    this.confirmSql(res)
                }else{
                    this.saveObj.id = this.dataId;
                    this.saveObj.querySql = this.syntaxData;
                    this.saveObj.saveId = this.saveId;
                    this.datacauseCommunicationService.previewConnections(this.saveObj);
                }
            }

            if (res.success == false) {
                this.dialogCommunicationService.addMessage({ severity: 'error', summary: '', detail: res.msg })
            }
        }).catch(err => this.dialogCommunicationService.addMessage({ severity: 'error', summary: 'sql查询失败', detail: err._body }))
    }

    confirmSql(res:any){
        this.datacauseCommunicationService.addConnections({syntaxName: res.data,id: this.dataId});
    }

    private saveId:number
    previewDatasource(id:any){
        console.log(id)
        this.saveId = id;
        this.confirm(id);
    }
}