import { Component, OnInit, Input } from '@angular/core';
import { RegexpSService } from 'src/app/@core/data/regexps.service';

@Component({
	selector: 'app-data-object-operate',
	templateUrl: './data-object-operate.component.html',
	styleUrls: ['./data-object-operate.component.css']
})
export class DataObjectOperateComponent implements OnInit {

	@Input() set _operateInfo(value: any) {
		this.operateInfo = Object.assign({}, value);
	}

	operateInfo: any = {};							// 数据对象操作信息
	errorInfo: any = {};							// 错误信息

	constructor(
		private regexpSService: RegexpSService
	) {

	}

	ngOnInit() {
	}

	/**
     * 名称（校验）
     * @param event 
     */
	changeName(event?: Event) {
		if (this.operateInfo && !this.operateInfo.name) {
			this.errorInfo.nameError = true;
			this.errorInfo.nameErrorInfo = "请输入对象名称";
			return false;
		}
		if (!/^\S.*\S$|^\S$/.test(this.operateInfo.name)) {
            this.errorInfo.nameError = true;
            this.errorInfo.nameErrorInfo = "开头结尾不能有空格";
            return false;
        } else if (!/^[a-zA-Z\d\u4e00-\u9fa5\-\_\&\\s]{2,50}$/.test(this.operateInfo.name)) {
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
		if (this.operateInfo && !this.operateInfo.code) {
			this.errorInfo.codeError = true;
			this.errorInfo.codeErrorInfo = "请输入对象编码";
			return false;
		}
		if (!(this.regexpSService.getCode().test(this.operateInfo.code))) {
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
        if (this.operateInfo.description && this.operateInfo.description.length > 200) {
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
