package td.enterprise.common.azkaban;

public enum AzkabanBizObjectTypeEnum {
    LookalikeCrowd("lookalikeCrowd", "lookalikeCrowd"),
    TagCalc("tag", "tagCalc"),
    CrowdExport("calcObject", "crowdExport"),
    SystemTag("systemTag", "systemTag"),
    MetaDataModelImport("calcObject", "metaDataModelImport"),
    MetaDataModelExport("calcObject", "metaDataModelExport"),
    MetaDataBackUp("calcObject", "metaDataModelBackUp"),
    MetaDataCleanUp("calcObject", "metaDataModelClearUp"),
    MetaDataRestore("calcObject", "metaDataModelRestore"),
    DataGatewayCalc("calcObject", "dataGatewayCalc"),
    CreateCrowdMappingTable("calcObject", "CreateCrowdMappingTable");

    private String bizObjectType;
    private String code;

    AzkabanBizObjectTypeEnum(String bizObjectType, String code) {
        this.bizObjectType = bizObjectType;
        this.code = code;
    }

    public String getBizObjectType() {
        return bizObjectType;
    }

    public String getCode() {
        return code;
    }
}
