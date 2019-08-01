
const metadataObj = {
        "dataSourceId": 10,
        "dataSourceType":"JDBC",
        "physicalMetaObjectName": "map",
        "metaObjectName": "chinaMap",
        "metaObjectType": "1",
        "status":"0",
        "metaObjectDescription": "是范德萨发",
        "attributes": [
            {
                "metaAttributeName": "ID",
                "metaAttributeType": "1",
                "metaAttributeDescripte": "主键",
                "isLogic": "0",
                "physicalMetaAttributeName": "ID",
                "physicalMetaAttributeType": "INT",
                "physicalMetaAttributeDescripte": "32",
                "isInput":'',
                "is_enum": "-1",
                "dictionaryId": '',
                "parentName": ''  
            },
            {
                "metaAttributeName": "name",
                "metaAttributeType": "2",
                "metaAttributeDescripte":"省份名",
                "isLogic": "0",
                "physicalMetaAttributeName": "name",
                "physicalMetaAttributeType": "varchar",
                "physicalMetaAttributeDescripte": "32",
                "isInput":'',
                "is_enum": "0",
                "dictionaryId": "4543",
                "parentName": "4"  
            },
            {
                "metaAttributeName": "value",
                "metaAttributeType": "3",
                "metaAttributeDescripte": "人数",
                "isLogic": "0",
                "physicalMetaAttributeName": "value",
                "physicalMetaAttributeType": "INT",
                "physicalMetaAttributeDescripte": "32",
                "isInput":'',
                "is_enum": "-1",
                "dictionaryId": '',
                "parentName": ''  
            },
            {
                "metaAttributeName": '',
                "metaAttributeType": '',
                "metaAttributeDescripte": '',
                "isLogic": "'-1'",
                "physicalMetaAttributeName": "value2",
                "physicalMetaAttributeType": "INT",
                "physicalMetaAttributeDescripte": "32",
                "isInput":'',
                "is_enum": "-1",
                "dictionaryId": '',
                "parentName": ''  
            }
        ]
    }

    const _metadataStep1Obj = {
    }

    const _metadataStep2Obj = {
        "physicalMetaObjectName": "",
        "physicalMetaObjectAttribute": '',
        "physicalMetaObjectTable": '',
        "physicalMetaObjectAttributeTable": '',
    }

    const _metadataStep3Obj = {
        "dataSourceId": "",
        "dataSourceType":"",
        "dataSourceName":"",
        "metaObjectName": "",
        "metaObjectType": "",
        "status": 1,
        "metaObjectDescription": "",
        "attributes":''
    }

    const _metadataStepInfo = {
        step1:{
            datasourceName:'',
            datasourceType:'',
            pageIndex:1
        },
        step2:{
            searchText:''
        },
        step3:{
            pageIndex:1,
            pageSize: 10
        }
    }

    export { metadataObj, _metadataStep1Obj, _metadataStep2Obj, _metadataStep3Obj, _metadataStepInfo };
