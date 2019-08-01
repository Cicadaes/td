import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppsService } from './apps.service';

@Component({
    selector: 'apps',
    templateUrl: './apps.component.html',
    styleUrls: ['./apps.component.css']
})
export class AppsComponent implements OnInit, OnDestroy {
    appFieldArray: any[];
    isShowAddAppModal = false;
    appTableFieldParams: any;

    appIconFile: any = {
        list: [],
        number: 2,
        apiUrl: 'attachmentController/uploadImage'
    };

    constructor(private service: AppsService) {

    }

    initAppFieldArray(): void {
        this.appFieldArray = [{
            id: 1,
            fieldName: 'name',
            fieldLabel: '应用名称',
            fieldType: 'input'
        }, {
            id: 2,
            fieldName: 'type',
            fieldLabel: '应用类型',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            selectOptions: [{
                value: '',
                label: '全部'
            }, {
                value: '1',
                label: '主应用'
            }, {
                value: '2',
                label: '增值包'
            }]
        }, {
            id: 3,
            fieldName: 'status',
            fieldLabel: '状态',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            selectOptions: [{
                value: '',
                label: '全部'
            }, {
                value: '1',
                label: '正常'
            }, {
                value: '0',
                label: '禁用'
            }]
        }
            // {
            //     id:2,
            //     fieldName:'createUserName',
            //     fieldLabel:'创建人',
            //     fieldType:'input'
            // },{
            //     id:4,
            //     fieldName:'createTimeRange',
            //     fieldLabel:'创建时间',
            //     fieldType:'date-range'
            // },{
            //     id:2,
            //     fieldName:'updateUserName',
            //     fieldLabel:'更新人',
            //     fieldType:'input'
            // },{
            //     id:4,
            //     fieldName:'updateTimeRange',
            //     fieldLabel:'更新时间',
            //     fieldType:'date-range'
            // }
        ];
    }
    ngOnInit() {
        this.appIconFile.list = [{
            uid: -1,
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }];
        this.initAppFieldArray();
    }

    onUploadAppIconFile(files: any[]) {
        // console.dir([files,'aaaa']);
    }

    showAddAppModal() {
        this.isShowAddAppModal = true;
    }
    hideAddAppModal(params: any) {
        this.isShowAddAppModal = false;
    }
    onSearchAppList(params: any) {
        this.appTableFieldParams = params;
    }
    ngOnDestroy() {

    }

}
