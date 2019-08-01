import {BaseStyle} from "../../../base/style.base";
/**
 * Created by wangshouyun on 2017/3/28.
 */


export class RightMenuStyle extends BaseStyle {

    constructor() {
        super();

        let style = `
      
       .rightMenu{
                position: absolute;
                width: 100px;      
                z-index: 9999;     
                display:none;
                background: #FFFFFF;
                box-shadow: 0 1px 4px 0 rgba(0,0,0,0.15);
                border-radius: 4px;
            }
        
            .rightMenu-list{
                text-indent:16px;
                position:relative;
                width: 100%;
                height:32px;
                line-height:32px;        
                cursor: pointer;
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: #657180;
                letter-spacing: 0;
               
            }
            
            .rightMenu-list-li{
                text-indent:16px;
                position:absolute;
                width: 100%;
                cursor: pointer;
                display:none;
                left:100px;
                top:0px;
                background: #FFFFFF;
                box-shadow: 0 1px 4px 0 rgba(0,0,0,0.15);
                border-radius: 4px;
            }
            
            .rightMenu-list:hover .rightMenu-list-li{
                display:block;
                
            }
             .rightMenu-list:hover{
                background: rgba(28,36,56,0.03);
             }

        `;

        this.instertToHead(style);
    }


}