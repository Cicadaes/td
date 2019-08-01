package com.talkingdata.datacloud.entity.report;

/**
 * <br>
 * <b>功能：</b><br>
 * <b>作者：</b>ss.qin<br>
 * <b>日期：</b> 2017/3/4 <br>
 * <b>版权所有：<b>Copyright(C) 2017, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DatasetField {
        private String fieldId;
        private String fieldName;
        private String fieldType;

        public DatasetField(){

        }

        public DatasetField(String fieldId,
                             String fieldName,
                             String fieldType) {
            this.fieldId = fieldId;
            this.fieldName = fieldName;
            this.fieldType = fieldType;
        }

        public String getFieldId() {
            return fieldId;
        }

        public void setFieldId(String fieldId) {
            this.fieldId = fieldId;
        }

        public String getFieldName() {
            return fieldName;
        }

        public void setFieldName(String fieldName) {
            this.fieldName = fieldName;
        }

        public String getFieldType() {
            return fieldType;
        }

        public void setFieldType(String fieldType) {
            this.fieldType = fieldType;
        }


}
