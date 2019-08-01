'use strict';

angular.module('wreport.app').factory('CommonUrl', function () {
    return {
        restServiceList: {
            // --------------------------------公共接口--------------------------------

            // 人群列表
            crowdList: {
                method: 'getList',
                url: 'api/crowds'
            },

            // 查询子项目
            childProject: {
                method: 'getListUrlParam',
                url: 'api/projects/{projectId}/childProject'
            },

            export2excel: {
                method: 'getOne',
                url: 'api/exports/export2excel'
            },

            //管理列表数据导出到excel
            download2excel: {
                method: 'getOne',
                url: 'api/exports/download2excel'
            },

            // 项目列表页面
            // 获取字典   ---  project  -- 新建店铺时要请求的一些下拉数据
            getMultiDict: {
                method: 'getOne',
                url: '/api/dics/name/ProjectType,ProjectCity,ActiveUserVisitMinutes,ProjectStayUserMinutes,ProjectTimeoutMinutes'
            },
            getMultiDict2: {
                method: 'getOne',
                url: '/api/dics/name/ProjectCity'
            },

            // 获取数据字典
            getMultiDictRoomList: {
                method: 'getOne',
                url: 'api/dics/name/StayMinutes'
            },

            // --------------------------------客源概览--------------------------------
            passengerCount: {
                method: 'getListUrlParam',
                url: '/api/passenger/passengerOverview/passengerCount/{projectId}/{date}'
            },
            // --------------------------------客流分布--------------------------------
            passengerDistributionCount: {
                method: 'getOne',
                url: '/api/passengerDist/passengerDistributionCount'
            },
            installInfosNew: {
                method: 'getOne',
                url: '/api/passengerDist/installInfosNew'
            },
            installInfosNewById: {
                method: 'getOne',
                url: '/api/passengerDist/installInfosNewById'
            },
            // --------------------------------客流趋势--------------------------------
            // 客流趋势接口，图表1
            passengerTrendTopData: {
                method: 'getOne',
                url: '/api/passengerTrend/passengerTrendTopData'
            },

            // 客流趋势图表2，到访人数
            passengerActiveSummary: {
                method: 'getOne',
                url: '/api/passengerTrend/passengerActiveSummary'
            },
            // 客流趋势图表2，进店人数
            passengerEnterSummary: {
                method: 'getOne',
                url: '/api/passengerTrend/passengerEnterSummary'
            },
            // 客流趋势图表2，停留人数
            passengerStaySummary: {
                method: 'getOne',
                url: '/api/passengerTrend/passengerStaySummary'
            },

            // 客流趋势明细，接口01
            passengerActiveList: {
                method: 'getOne',
                url: '/api/passengerTrend/passengerActiveList'
            },
            // 客流趋势明细，接口02
            passengerEnterList: {
                method: 'getOne',
                url: '/api/passengerTrend/passengerEnterList'
            },
            // 客流趋势明细，接口03    // 查询客流明细时，在原有的参数基础上添加
            passengerEnterRateList: {
                method: 'getOne',
                url: '/api/passengerTrend/passengerEnterRateList'
            },
            // 客流趋势明细，接口04   // 查询客流明细时，在原有的参数基础上添加
            passengerStayList: {
                method: 'getOne',
                url: '/api/passengerTrend/passengerStayList'
            },
            // 客流趋势明细，接口05   // 查询客流明细时，在原有的参数基础上添加
            passengerStayRateList: {
                method: 'getOne',
                url: '/api/passengerTrend/passengerStayRateList'
            },
            // --------------------------------到访深度--------------------------------
            // 头部数据
            depthSummary: {
                method: 'getOne',
                url: '/api/visitDepth/depthSummary'
            },
            // 头部，人均进店数量
            enterRoomDegreeList: {
                method: 'getOne',
                url: '/api/visitDepth/enterRoomDegreeList'
            },
            // 头部，驻留时长分布
            visitTimesDuration: {
                method: 'getOne',
                url: '/api/visitDepth/visitTimesDuration'
            },
            // 折线，人均进店数量
            avarageEnterRoomCount: {
                method: 'getOne',
                url: '/api/visitDepth/avarageEnterRoomCount'
            },
            // 折线，人均停留时长
            avarageStayDuration: {
                method: 'getOne',
                url: '/api/visitDepth/avarageStayDuration'
            },

            // 明细，人均进店数量详情列表
            queryEnterShopList: {
                method: 'getOne',
                url: '/api/visitDepth/queryEnterShopList'
            },
            // 明细，人均停留时长详情列表
            avarageStayDurationDetail: {
                method: 'getOne',
                url: '/api/visitDepth/avarageStayDurationDetail'
            },
            // --------------------------------房店分析--------------------------------
            // 房店指标，top10房间
            queryTop: {
                method: 'getOne',
                url: '/api/projectDist/queryTop'
            },

            // 房店指标，top10房间 停留率
            queryTopRate: {
                method: 'getOne',
                url: '/api/projectDist/queryTopRate'
            },

            // 房店指标，坪效指标
            queryDensity: {
                method: 'getOne',
                url: '/api/projectDist/queryDensity'
            },

            // 房店指标，客流明细
            queryAverageDetail: {
                method: 'getOne',
                url: '/api/projectDist/queryAverageDetail'
            },
            // 指标明细历史详情
            queryProjectAverageDetail: {
                method: 'getOne',
                url: '/api/projectDist/queryProjectAverageDetail'
            },
            // --------------------------------客流分析器--------------------------------
            enterPassenger: {
                method: 'getList',
                url: 'api/targetCompare/enterPassenger'
            },
            stayPassenger: {
                method: 'getList',
                url: 'api/targetCompare/stayPassenger'
            },
            stayRate: {
                method: 'getList',
                url: 'api/targetCompare/stayRate'
            },
            avgStayDuration: {
                method: 'getList',
                url: 'api/targetCompare/avgStayDuration'
            },
            // --------------------------------客群画像--------------------------------
            // 人口属性
            querySexRate: {
                method: 'getOne',
                url: '/api/passenger/querySexRate'
            },
            queryAgeDistribution: {
                method: 'getOne',
                url: '/api/passenger/queryAgeDistribution'
            },
            queryMarryCarChild: {
                method: 'getOne',
                url: '/api/passenger/queryMarryCarChild'
            },

            // 消费能力
            queryPhoneBrandList: {
                method: 'getOne',
                url: '/api/passenger/queryPhoneBrandList'
            },
            queryPhonePriceList: {
                method: 'getOne',
                url: '/api/passenger/queryPhonePriceList'
            },
            queryShopCenterList: {
                method: 'getOne',
                url: '/api/passenger/queryShopCenterList'
            },
            queryShopBrandList: {
                method: 'getOne',
                url: '/api/passenger/queryShopBrandList'
            },
            queryRestaurantBrandList: {
                method: 'getOne',
                url: '/api/passenger/queryRestaurantBrandList'
            },
            // 媒体触点
            queryAppUseTimeList: {
                method: 'getOne',
                url: '/api/passenger/queryAppUseTimeList'
            },
            queryAppUseList: {
                method: 'getOne',
                url: '/api/passenger/queryAppUseList'
            },
            //媒体触点app类型
            projectAppTypess: {
                method: 'getList',
                url: 'api/projectAppTypess'
            },
            // 应用偏好
            // 客群画像应用覆盖率，雷达图
            selectForRadar: {
                method: 'getOne',
                url: '/api/passenger/selectForRadar'
            },
            // 客群画像应用提升度
            selectAppPreference: {
                method: 'getOne',
                url: '/api/passenger/selectAppPreference'
            },
            // --------------------------------职住来源--------------------------------
            // TOP20小区
            tenantTopAreaCounts: {
                method: 'getOne',
                url: '/api/tenantTopAreaCounts'
            },

            // 职住来源
            tenantJobHousingCounts: {
                method: 'getOne',
                url: '/api/tenantJobHousingCounts'
            },

            // 区域来源
            tenantRegionCountsNew: {
                method: 'getOne',
                url: '/api/tenantRegionCountsNew'
            },

            getRegionCountList: {
                method: 'getOne',
                url: '/api/getRegionCountList'
            },

            // 区域来源--坐标点
            cityRegionsNew: {
                method: 'getOne',
                url: '/api/cityRegionsNew'
            },
            // --------------------------------竞品概览--------------------------------
            // 新建竞品项目
            CreateNewCompeteProject: {
                method: 'create',
                url: "api/competeProjects"
            },
            updateCompeteAttributes: {
                method: 'updatePost',
                url: "api/competeAttributes/update"
            },
            // 竞品项目
            querySubProjectList: {
                method: 'getList',
                url: 'api/competeProjects'
            },
            // 客群辐射分布
            customerDistribution: {
                method: 'getOne',
                url: 'api/tenantHousingCoverageCounts/customerDistribution'
            },
            // 关联度指标
            relevancyIndex: {
                method: 'getOne',
                url: 'api/tenantCorrelationCounts/relevancyIndex'
            },
            // TOP10店铺排名
            queryTopRoomList10: {
                method: 'getOne',
                url: 'api/projectDist/queryTopRoomList'
            },
            // --------------------------------人群管理--------------------------------
            // 客户围群项目列表
            GetcustomCrowdList: {
                method: 'getList',
                url: 'api/customCrowds'
            },
            // --------------------------------人群管理 聚类详情--------------------------------
            // 加载头部信息
            getKmeansCrowdData: {
                method: 'getOneBy',
                url: 'api/kmeansCrowds/'
            },
            // 聚类结果详情
            queryClassificationByParam: {
                method: 'getList',
                url: 'api/kmeansCrowdResults/queryClassificationByParam'
            },
            // 聚类结果
            getKmeansCrowdResultData: {
                method: 'getList',
                url: 'api/kmeansCrowdResults/queryResultById'
            },
            // --------------------------------人群管理 行为详情--------------------------------
            // 人口属性
            // 性别比例
            BehaviorCrowdSexRate: {
                method: 'getOne',
                url: 'api/passenger/queryBehaviorCrowdSexRate'
            },
            // 年龄分布
            BehaviorCrowdAgeDistribution: {
                method: 'getOne',
                url: 'api/passenger/queryBehaviorCrowdAgeDistribution'
            },
            // 婚否，车否，孩儿否
            BehaviorCrowdMarryCarChild: {
                method: 'getOne',
                url: 'api/passenger/queryBehaviorCrowdMarryCarChild'
            },
            // 消费能力 手机品牌
            BehaviorCrowdPhoneBrandList: {
                method: 'getOne',
                url: 'api/passenger/queryBehaviorCrowdPhoneBrandList'
            },
            // 手机价格
            BehaviorCrowdPhonePriceList: {
                method: 'getOne',
                url: 'api/passenger/queryBehaviorCrowdPhonePriceList'
            },
            // 应用偏好 应用偏好覆盖率
            selectForBehaviorRadar: {
                method: 'getOne',
                url: 'api/passenger/selectForBehaviorRadar'
            },
            // 应用偏好提升度
            selectBehaviorAppPreference: {
                method: 'getOne',
                url: 'api/passenger/selectBehaviorAppPreference'
            },
            // --------------------------------人群管理 潜客详情--------------------------------
            // 左上描述
            LookalikeCrowdList: {
                method: 'getListUrlParam',
                url: 'api/lookalikeCrowds/{id}'
            },
            // 请求地图上的数据点
            LookalikeJobHousing: {
                method: 'getOne',
                url: 'api/tenantLookalikeJobHousingCounts'
            },

            // --------------------------------构建人群--------------------------------
            kmeansCrowds_crate: {
                method: 'create',
                url: 'api/kmeansCrowds'
            },
            //
            behaviorCrowds_create: {
                method: 'create',
                url: 'api/behaviorCrowds/create'
            },

            //停止计算任务
            cancelAzkabanTask: {
                method: 'getListUrlParam',
                url: 'api/kmeansCrowds/cancelAzkabanTask/{crowdId}'
            },

            // 双击可编辑 -- 编辑后保存更改
            SaveClassification: {
                method: 'create',
                url: 'api/kmeansCrowdResults/updateClassification'
            },

            CreatelookalikeCrowd: {
                method: 'create',
                url: 'api/lookalikeCrowds'
            },

            // --------------------------------工具箱 目标管理--------------------------------
            targets: {
                method: 'getList',
                url: 'api/targets'
            },
            QueryTargetManagementList: {
                method: 'getList',
                url: "api/targetManagements"
            },
            // 新建目标
            CreatetargetManagement: {
                method: 'create',
                url: "api/targetManagements"
            },
            // 新建历史  -- 停止目标列表任务，变成历史纪录
            CreateHisTargetManagementsStop: {
                method: 'create',
                url: "api/targetManagementsStop"
            },
            // --------------------------------工具箱 下载管理--------------------------------
            //重复
            downloadDatas: {
                method: 'getList',
                url: 'api/downloadDatas'
            },
            checkDownload: {
                method: 'getListUrlParam',
                url: 'api/downloadDatas/checkDownload/{dataId}'
            },
            //重复
            // 请求下载任务数据，历史数据
            GetDownloadData: {
                method: 'getList',
                url: 'api/downloadDatas'
            },
            // 新建下载任务
            CreateDownloadData: {
                method: 'create',
                url: 'api/downloadDatas'
            },
// --------------------------------数据管理 探针管理--------------------------------
            // 探针列表
            sensorList: {
                method: 'getList',
                url: 'api/sensors'
            },
            // 查看探针详情探针
            sensorDetail: {
                method: 'especially',
                url: 'api/sensors/{{sensorId}}/detail',
                url1: 'api/sensors/',
                url2: '/detail'
            },
            // 编辑探针
            GetSensorDetial: {
                method: 'editSensor',
                url: 'api/sensors/'
            },
            // 新建探针
            CreatetNewSensor: {
                method: 'create',
                url: 'api/sensors'
            },
            // 编辑历史
            SensorUpdataHistroy: {
                method: 'getList',
                url: 'api/sensors/history'
            },
            // 查看探针编辑记录
            SensorHistroyList: {
                method: 'mosaicId',
                url: 'api/sensors/history/',
                mosaicId: "sensorId"
            },

            // 查看探针编辑记录
            SensorStrengthMac: {
                method: 'especially',
                url1: 'api/sensors/',
                url2: '/macList',
                url: 'api/sensors/{sensorMac}/macList'
            },
            // 查看保存了得测试报告
            GetSensorMacListNode: {
                method: 'especially2',
                url1: 'api/sensorTests/',
                url2: '/history',
                url: 'api/sensorTests/{projectId}/{sensorId}/history'
            },
            // 保存测试报告
            saveSensorNode: {
                method: 'create',
                url: 'api/sensorTests'
            },
            // // 获取已经向collector发数的mac列表
            GetUserMacList: {
                method: 'getList',
                url: 'api/sensors/noTypeInSensors'
            },
// --------------------------------数据管理 场地管理--------------------------------
            // 建新房间查询场地下拉列表    // 探针管理页面，高级搜索中所在场地下拉列表
            ProjectPlaceList: {
                method: 'getList',
                url: 'api/projectPlaces'
            },
            // 新建场地图纸
            NewProjectPlace: {
                method: 'create',
                url: 'api/projectPlaces'
            },
            // 保存场地排序
            SaveProjectPlaceOrder: {
                method: 'createOrder',
                url: 'api/projectPlaces/updateOrderNumber'
            },
            sensorInstallInfos: {
                method: 'getList',
                url: 'api/installInfos/sensor4Shop'
            },
            sensorInstallInfosUpdate: {
                method: 'create',
                url: 'api/installInfos/updateNew'
            },
            // 获取场地图片
            GetProjectAreaPic: {
                method: 'getOne',
                url: 'api/projectPlaces/selectSingle'
            },
            // 图纸管理还原设置
            RemoveProjectAreaPic: {
                method: 'getOne',
                url: 'api/installInfos/restore'
            },
            // --------------------------------数据管理 黑名单管理--------------------------------
            // 黑名单管理
            // mac列表
            GetcrowdBlackList: {
                method: 'getList',
                url: 'api/crowdBlackLists'
            },
            // 品牌店mac列表
            QueryStoreBlackList: {
                method: 'getList',
                url: 'api/storeBlackLists'
            },
            // 按规则过滤  -- get
            crowdBlackListGetProjectRules: {
                method: 'getOneBy',
                url: 'api/crowdBlackLists/getProjectRules/'
            },
            // 按规则过滤修改并运行
            FilterByRulesCrowdBlackList: {
                method: 'getList',
                url: 'api/crowdBlackLists/filterByRules'
            },
            // 按规则过滤修改并运行
            FilterByStayCrowdBlackList: {
                method: 'getList',
                url: 'api/crowdBlackLists/filterByMaxDuration'
            },
            // 新建黑名单
            createCrowdBlackList: {
                method: 'create',
                url: 'api/crowdBlackLists'
            },
            // 新建CreateStoreBlackList
            CreateStoreBlackList: {
                method: 'create',
                url: 'api/storeBlackLists'
            },

// =======================客流分析器===============================
            // 原查看交叉分析数据接口
            coordinateInfo: {
                method: 'getOne',
                url: 'api/projectSalesVolumns/coordinateInfo'
            },
            // ========= 新增交叉分析 ================
            // 获取交叉分析列表
            GetAnalysisList: {
                method: 'getList',
                url: 'api/crossAnalysiss'
            },
            // 新建交叉分析，开始计算
            StartCompute: {
                method: 'create',
                url: 'api/crossAnalysiss/startCompute'
            },
            // 交叉分析保存结果
            SaveResult: {
                method: 'create',
                url: 'api/crossAnalysiss/saveResult'
            },
            // 交叉分析列表查看功能
            SeeOneAnalysis: {
                method: 'seeAna',
                url: 'api/crossAnalysiss/getResult'
            },

// ========================= project 相关接口  =============================
            // 查看记录功能接口
            ViewLog: {
                method: 'getOne',
                url: "api/projectUserRelations/queryForIndex"
            },
            // 产看记录功能接口
            CreatViewLog: {
                method: 'create',
                url: "api/projectUserRelations"
            },
            // 请求项目列表
            GetProjectList: {
                method: 'getList',
                url: "api/projects"
            },
            // 请求项目列表
            GetProjectListExcel: {
                method: 'getOne',
                url: 'api/exports/download2excel/project'
            },
            // 探针管理后台 ---  门店管理
            GetProjectStoreList: {
                method: 'getList',
                url: "api/projects/project/principalList"
            },
            // 探针管理后台 ---  探针管理
            GetProjectSensorList: {
                method: 'getList',
                url: "api/projects/sensorList"
            },
            // 探针管理后台 --- 预警设置
            GetWarningSetting: {
                method: 'getOne',
                url: "api/warningConfigs"
            },
            // 探针管理后台 --- 新建预警设置
            CreateWarningSetting: {
                method: 'create',
                url: "api/warningConfigs"
            },
            // 请求项目详情列表
            GetProjectListDetails: {
                method: 'getList',
                url: "api/projects/details"
            },
            // 新建店组时   ---  可分配的点组合店铺
            GetProjectShopGroupList: {
                method: 'getList',
                url: "api/projects"
            },
            // 获取店铺的新增品牌
            GetProjectBrand: {
                method: 'getOne',
                url: "api/metaDatas/type/BRAND_1"
            },
            // 新建店铺的新增品牌
            CreateProjectBrand: {
                method: 'create',
                url: "api/metaDatas/addMetaData"
            },
            // 获取店铺的新增类型
            GetProjectType: {
                method: 'getOne',
                url: "api/roomCategories"
            },
            // 新建店铺的新增品牌
            CreateProjectType: {
                method: 'create',
                url: "api/roomCategories"
            },
            // 新建项目接口
            CreateNewProject: {
                method: 'create',
                url: "api/projects"
            },
            // 编辑项目 请求数据 -- get方法
            EditShopGroup: {
                method: 'edit',
                url: "api/projects/"
            },
            // 置顶功能
            MakeTop: {
                method: "create",
                url: "api/projectUserRelations"
            },
            // 收藏功能
            CollectOne: {
                method: "create",
                url: "api/projectUserRelations"
            },
            // 取消收藏功能
            RemoveCollectOne: {
                method: "remove",
                url: "api/projectUserRelations"
            },
            // 联动查询
            GetLinkageQuery: {
                method: 'getListUrlParam',
                url: 'api/projects/{projectId}/childProject'
            },
            // 查看店铺探针详情
            GetStroeSensorDetail: {
                method: 'getOneBy',
                url: 'api/projects/project/detail/'
            },
// =========================   路径分析 相关接口   =============================
            // 获取所选择的店铺店组
            GetCorrelatProject: {
                method: 'getListUrlParam',
                url: 'api/projects/{projectId}/direct-children'
            },
            // 探针列表
            GetCorrelationAnalysisList: {
                method: 'getList',
                url: 'api/relevancy-analysisss'
            },
            CreatetNewCorrelationAnalysis: {
                method: 'create',
                url: 'api/relevancy-analysisss'
            },
            // 获取所选择的店铺店组
            GetCorrelationAnalysisDetail: {
                method: 'mosaicId',
                url: 'api/relevancy-analysisss/updown/',
                mosaicId: "analysissId"
            },
            GetCorrelationAnalysisProjectList: {
                method: 'mosaicId',
                url: 'api/relevancy-analysisss/project/',
                mosaicId: "analysissId"
            },
            GetCorrelationAnalysisCrowdList: {
                method: 'mosaicId',
                url: '/api/customCrowds/',
                mosaicId: "projectId"
            },
// ========================= 批量设置功能 相关接口  =============================
            // 查批量设置列表
            GetBatchSetList: {
                method: 'getList',
                url: "api/projectBatchConfigs"
            },
            // 查批量设置详情
            GetBatchSetDetail: {
                method: 'getList',
                url: 'api/projectBatchConfigs/getBatchConfigDetail'
            },
            // 查批量设置存储
            SaveBatchSets: {
                method: 'create',
                url: 'api/projectBatchConfigs/setBatchConfig'
            },
// ====================== 探针勘测页面 ==============================
            GetSensorSurveyList: {
                method: 'getList',
                url: "api/sensorCheckLogs"
            },
            // 新建
            CreateSensorSurvey: {
                method: 'create',
                url: "api/sensorChecks"
            },
// ====================== 图纸管理 ==============================
            // 图纸管理店铺列表查询
            GetDrawingManagementList: {
                method: 'getList',
                url: "api/projects/shopList4drawings"
            },
            SaveProjectPlacePic: {
                method: 'create',
                url: "api/projects/updatePicUrl"
            },
// ====================== 阈值设置 ==============================
            // 阈值设置查询接口
            GetThresholdSetProjectList: {
                method: 'getOne',
                url: "api/thresholds/queryByProjectIds"
            },
            // 阈值店铺列表查询
            GetThresholdSetList: {
                method: 'getList',
                url: "api/projects/shopListByCondition"
            },
            // 保存阈值设置
            SaveThresholdSet: {
                method: 'create',
                url: 'api/thresholds'
            },
            // 阈值设置单项查询
            GetOneThresholdSet: {
                method: 'getOne',
                url: 'api/thresholds/queryByProjectId'
            },
            // 阈值设置下载上传的黑名单文件
            DownLoadBlackText: {
                method: 'getOne',
                url: 'api/thresholds/download'
            },
// ====================== 项目管理 ============================
            // 查询项目列表
            GetProjectManagementList: {
                method: 'getList',
                url: "api/projects/shopListByCondition"
            },
            // 查询自定义项目列表
            GetCustomProjectList: {
                method: 'getList',
                url: "api/projects/shopList"
            },
            // 编辑项目 请求数据 -- get方法
            GetOneCustomProject: {
                method: 'edit',
                url: "api/projects/single/"
            },
// ====================== 排行榜 ==============================
            // 机构排名列表
            GetMechanismRankingList: {
                method: 'getList',
                url: "api/metricDay/pageList"
            },
            // 机构排名下拉框数据
            GetSpinnerList: {
                method: 'getList',
                url: "api/projects/shopList"
            },
            // 联动获取城市等级
            GetProvinceCityLevel: {
                method: 'getList',
                url: "api/getSonLevel"
            },
            // 请求项目列表
            GetProjectRankingListExcel: {
                method: 'getOne',
                url: 'api/exports/download2excel/metricDay'
            },
// ====================== 新增 页面上没有 ==============================
            poiCrowd: {
                method: 'create',
                url: "api/mc/poiCrowd"
            },

            competeSources: {
                method: 'getList',
                url: "api/competeSources"
            },

            competeRelationAll: {
                method: 'getList',
                url: "api/competeProjects/tenant"
            },

            competeRelationSave: {
                method: 'create',
                url: "api/competeProjects/relation"
            }
        }
    };
});

