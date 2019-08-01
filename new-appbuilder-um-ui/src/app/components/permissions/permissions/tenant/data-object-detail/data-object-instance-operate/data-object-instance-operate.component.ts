import { Component, OnInit, Input } from '@angular/core';
import { DataObjectDetailService } from '../data-object-detail.service';
import { RegexpSService } from 'src/app/@core/data/regexps.service';

@Component({
    selector: 'app-data-object-instance-operate',
    templateUrl: './data-object-instance-operate.component.html',
    styleUrls: ['./data-object-instance-operate.component.css']
})
export class DataObjectInstanceOperateComponent implements OnInit {

    instanceOperateInfo: any = {};					// 数据对象实例操作信息
    errorInfo: any = {};							// 错误信息
    dependentOperateList: any = [];                 // 依赖操作列表（其实就是数据对象实例操作列表）

    @Input()dataObjId: any;                         // 数据对象id
    @Input() set _instanceOperateInfo(value: any) {
		this.instanceOperateInfo = Object.assign({}, value);
	}

    constructor(
        private dataObjectDetailService: DataObjectDetailService,
        private regexpSService: RegexpSService,
    ) {

    }

    ngOnInit() {
        this.getSelectList();
    }

    /**
     * 获取依赖操作的下拉列表
     */
    getSelectList(){
        let param = {
            targetId: this.dataObjId
        }
        this.dataObjectDetailService.getDataObjInstanceOperateList(param).then(response => {
            if(response['code'] === 200){
                let arr = response['data'];
                // 修改需要过滤当前的操作（不能自关联）
                if(this.instanceOperateInfo.id){
                    arr = [];
                    response['data'].forEach(element => {
                        if(element.id != this.instanceOperateInfo.id){
                            arr.push(element);
                        }
                    });
                }
                this.dependentOperateList = arr;
            }
        });
    }

    /**
     * 名称（校验）
     * @param event 
     */
	changeName(event?: Event) {
		if (this.instanceOperateInfo && !this.instanceOperateInfo.name) {
			this.errorInfo.nameError = true;
			this.errorInfo.nameErrorInfo = "请输入操作名称";
			return false;
		}
		if (!/^\S.*\S$|^\S$/.test(this.instanceOperateInfo.name)) {
            this.errorInfo.nameError = true;
            this.errorInfo.nameErrorInfo = "开头结尾不能有空格";
            return false;
        } else if (!/^[a-zA-Z\d\u4e00-\u9fa5\-\_\&\\s]{2,50}$/.test(this.instanceOperateInfo.name)) {
            this.errorInfo.nameError = true;
            this.errorInfo.nameErrorInfo = "只能输入中文、数字、英文字母、“-_&”、空格，长度最少2个字符、最多50个字符";
            return false;
        } else {
			this.errorInfo.nameError = false;
			this.errorInfo.nameErrorInfo = '';
			return true;
		}
	}

    /**
     * 编码（校验）
     * @param event 
     */
	changeCode(event?: Event) {
		if (this.instanceOperateInfo && !this.instanceOperateInfo.code) {
			this.errorInfo.codeError = true;
			this.errorInfo.codeErrorInfo = "请输入操作编码";
			return false;
		}
		if (!(this.regexpSService.getCode().test(this.instanceOperateInfo.code))) {
			this.errorInfo.codeError = true;
			this.errorInfo.codeErrorInfo = "只能输入数字、英文字母，长度最少2个、最多50个字符";
			return false;
		} else {
			this.errorInfo.codeError = false;
			this.errorInfo.codeErrorInfo = '';
			return true;
		}
    }
    
    /**
     * 描述（校验）
     * @param event 
     */
    changeDescription(event?: Event) {
        if (this.instanceOperateInfo.description && this.instanceOperateInfo.description.length > 200) {
            this.errorInfo.descriptionError = true;
            this.errorInfo.descriptionErrorInfo = "描述长度不能大于200";
            return false;
        } else {
            this.errorInfo.descriptionError = false;
            this.errorInfo.descriptionErrorInfo = '';
            return true;
        }
    }

}
