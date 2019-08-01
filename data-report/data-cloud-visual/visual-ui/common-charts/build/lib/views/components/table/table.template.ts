/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "../../base/template.base";

export class TableTemplate extends BaseTemplate{
    constructor(scopeID: String,TableComponent:any){
        super(`<div component id=${scopeID} class="tableComponent" style="width:100%;height: 100%;">
                    <div tableSelect style="width:100%;height:45px;display:none;padding:0 24px;">
                        <div class="table-selectline fl">                        
                            <div class="table-selectline-title" commonChange>请选择</div>
                            <div class="table-selectline-list"></div>                        
                        </div>
                        <div class="saveCrowdBtn fr">另存人群</div>
                    </div>                                      
                    <div tableContainer style="width:100%;"></div>                   

                    
                </div>`)
    }
}