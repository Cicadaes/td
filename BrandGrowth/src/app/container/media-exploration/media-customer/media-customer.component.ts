import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { FilterPercentPipe } from '../../../pipes/filter-percent.pipe'

import { Store } from '@ngrx/store';
import * as reducer from '../../../ngrx/reducer';
import * as global from '../../../ngrx/action/global';
// import services
import { MediaExploreSourceService } from '../../../services/source/mediaExplore.source.service'
@Component({
  selector: 'media-customer',
  templateUrl: './media-customer.component.html',
  styleUrls: ['./media-customer.component.less'],
  providers: [
    MediaExploreSourceService,
  ]
})
export class MediaCustomerContainerComponent implements OnInit {
  private totalData: any =
    [
      {
        "mediaName": "媒体名称1",
        "mediaId": 2,
        "occupancyRatio": "0.00",   //当前媒体受众综合占比
        "contactRatio": [           //关联媒体
          {
            "mediaName": "京东",
            "ratio": 34.13,
          },
          {
            "mediaName": "淘宝",
            "ratio": 12.40,
          }],
        "audiencesRatio": [         //受众占比
          {
            "name": "人群-3",
            "ratio": 12.42
          },
          {
            "name": "人群-2",
            "ratio": 43.01
          }],
        "label":
          {
            "city":
              {
                "北京": "1.67"
              },
            "type":
              {
                "房产": "0.00",
                "应用商店": "0.01",
                "餐饮": "0.00",
                "汽车服务": "0.00",
                "金融理财": "0.02",
                "工具": "0.26",
                "人力资源": "0.00",
                "健康美容": "0.00",
                "阅读": "0.01",
                "母婴": "0.00",
                "unknown": "0.31",
                "网络购物": "0.00",
                "新闻": "0.01",
                "音乐": "0.08",
                "社区服务": "0.00",
                "视频": "0.01",
                "O2O": "0.00",
                "医疗": "0.00",
                "通讯社交": "0.04",
                "分类信息": "0.00",
                "游戏": "0.00",
                "图片摄影": "0.00",
                "智能硬件": "0.00",
                "快递物流": "0.00",
                "地图导航": "0.02",
                "出行": "0.00",
                "旅游": "0.00",
                "教育": "0.01"
              },
            "marriage":
              {
                "已婚": "10.75"
              },
            "age":
              {
                "26-35岁": "11.07"
              },
            "gender":
              {
                "男": "8.82"
              },
            "cars":
              {
                "有车": "4.40"
              },
            "carrier":
              {
                "中国移动": "6.80"
              },
            "net":
              {
                "WIFI": "1.67"
              }
          },
        "tgi":
          {
            "media":               //媒体特征
              {
                "已婚": "0.00",
                "男": "32.44",
                "有车": "0.00",
                "中国移动": "0.00",
                "WIFI": "0.00",
                "19-25岁": "0.00",
                "北京": "83.70"
              },
            "type":                //应用分类
              {
                "房产": "0.00",
                "应用商店": "165.38",
                "餐饮": "0.00",
                "汽车服务": "0.00",
                "金融理财": "110.26",
                "工具": "100.00",
                "人力资源": "0.00",
                "健康美容": "0.00",
                "阅读": "165.38",
                "母婴": "0.00",
                "unknown": "96.73",
                "网络购物": "0.00",
                "新闻": "165.38",
                "音乐": "94.51",
                "社区服务": "0.00",
                "视频": "165.38",
                "O2O": "0.00",
                "医疗": "0.00",
                "通讯社交": "94.51",
                "分类信息": "0.00",
                "游戏": "0.00",
                "图片摄影": "0.00",
                "智能硬件": "0.00",
                "快递物流": "0.00",
                "地图导航": "82.69",
                "出行": "0.00",
                "旅游": "0.00",
                "教育": "165.38"
              },
          }
      }, {
        "mediaName": "媒体名称2",
        "mediaId": 3,
        "occupancyRatio": "30.00",   //当前媒体受众综合占比
        "contactRatio": [           //关联媒体
          {
            "mediaName": "京东",
            "ratio": 34.13,
          },
          {
            "mediaName": "天猫",
            "ratio": 12.40,
          }],
        "audiencesRatio": [         //受众占比
          {
            "name": "人群-1",
            "ratio": 12.42
          },
          {
            "name": "人群-22",
            "ratio": 43.01
          }],
        "label":
          {
            "city":
              {
                "北京": "1.67"
              },
            "type":
              {
                "房产": "0.00",
                "应用商店": "0.01",
                "餐饮": "0.00",
                "汽车服务": "0.00",
                "金融理财": "0.02",
                "工具": "0.26",
                "人力资源": "0.00",
                "健康美容": "0.00",
                "阅读": "0.01",
                "母婴": "0.00",
                "unknown": "0.31",
                "网络购物": "0.00",
                "新闻": "0.01",
                "音乐": "0.08",
                "社区服务": "0.00",
                "视频": "0.01",
                "O2O": "0.00",
                "医疗": "0.00",
                "通讯社交": "0.04",
                "分类信息": "0.00",
                "游戏": "0.00",
                "图片摄影": "0.00",
                "智能硬件": "0.00",
                "快递物流": "0.00",
                "地图导航": "0.02",
                "出行": "0.00",
                "旅游": "0.00",
                "教育": "0.01"
              },
            "marriage":
              {
                "已婚": "16.75"
              },
            "age":
              {
                "26-35岁": "11.07"
              },
            "gender":
              {
                "男": "8.82"
              },
            "cars":
              {
                "有车": "4.40"
              },
            "carrier":
              {
                "中国移动": "0.00"
              },
            "net":
              {
                "WIFI": "1.67"
              }
          },
        "tgi":
          {
            "media":               //媒体特征
              {
                "已婚": "0.00",
                "男": "32.44",
                "有车": "0.00",
                "中国移动": "0.00",
                "WIFI": "0.00",
                "19-25岁": "0.00",
                "北京": "83.70"
              },
            "type":                //应用分类
              {
                "房产": "0.00",
                "应用商店": "165.38",
                "餐饮": "0.00",
                "汽车服务": "0.00",
                "金融理财": "110.26",
                "工具": "100.00",
                "人力资源": "0.00",
                "健康美容": "0.00",
                "阅读": "165.38",
                "母婴": "0.00",
                "unknown": "96.73",
                "网络购物": "0.00",
                "新闻": "165.38",
                "音乐": "94.51",
                "社区服务": "0.00",
                "视频": "165.38",
                "O2O": "0.00",
                "医疗": "0.00",
                "通讯社交": "94.51",
                "分类信息": "0.00",
                "游戏": "0.00",
                "图片摄影": "0.00",
                "智能硬件": "0.00",
                "快递物流": "0.00",
                "地图导航": "82.69",
                "出行": "0.00",
                "旅游": "0.00",
                "教育": "165.38"
              },
          }
      },
      {
        "mediaName": "媒体名称3",
        "mediaId": 4,
        "occupancyRatio": "2.00",   //当前媒体受众综合占比
        "contactRatio": [           //关联媒体
          {
            "mediaName": "京东",
            "ratio": 34.13,
          },
          {
            "mediaName": "淘宝",
            "ratio": 12.40,
          }],
        "audiencesRatio": [         //受众占比
          {
            "name": "人群-1",
            "ratio": 12.42
          },
          {
            "name": "人群-2",
            "ratio": 43.01
          }],
        "label":
          {
            "city":
              {
                "北京": "1.67"
              },
            "type":
              {
                "房产": "0.00",
                "应用商店": "0.01",
                "餐饮": "0.00",
                "汽车服务": "0.00",
                "金融理财": "0.02",
                "工具": "0.26",
                "人力资源": "0.00",
                "健康美容": "0.00",
                "阅读": "0.01",
                "母婴": "0.00",
                "unknown": "0.31",
                "网络购物": "0.00",
                "新闻": "0.01",
                "音乐": "0.08",
                "社区服务": "0.00",
                "视频": "0.01",
                "O2O": "0.00",
                "医疗": "0.00",
                "通讯社交": "0.04",
                "分类信息": "0.00",
                "游戏": "0.00",
                "图片摄影": "0.00",
                "智能硬件": "0.00",
                "快递物流": "0.00",
                "地图导航": "0.02",
                "出行": "0.00",
                "旅游": "0.00",
                "教育": "0.01"
              },
            "marriage":
              {
                "已婚": "10.75"
              },
            "age":
              {
                "26-35岁": "11.07"
              },
            "gender":
              {
                "男": "8.82"
              },
            "cars":
              {
                "有车": "4.40"
              },
            "carrier":
              {
                "中国移动": "0.00"
              },
            "net":
              {
                "WIFI": "1.67"
              }
          },
        "tgi":
          {
            "media":               //媒体特征
              {
                "已婚": "0.00",
                "男": "32.44",
                "有车": "0.00",
                "中国移动": "0.00",
                "WIFI": "0.00",
                "19-25岁": "0.00",
                "北京": "83.70"
              },
            "type":                //应用分类
              {
                "房产": "0.00",
                "应用商店": "165.38",
                "餐饮": "0.00",
                "汽车服务": "0.00",
                "金融理财": "110.26",
                "工具": "100.00",
                "人力资源": "0.00",
                "健康美容": "0.00",
                "阅读": "165.38",
                "母婴": "0.00",
                "unknown": "96.73",
                "网络购物": "0.00",
                "新闻": "165.38",
                "音乐": "94.51",
                "社区服务": "0.00",
                "视频": "165.38",
                "O2O": "0.00",
                "医疗": "0.00",
                "通讯社交": "94.51",
                "分类信息": "0.00",
                "游戏": "0.00",
                "图片摄影": "0.00",
                "智能硬件": "0.00",
                "快递物流": "0.00",
                "地图导航": "82.69",
                "出行": "0.00",
                "旅游": "0.00",
                "教育": "165.38"
              },
          }
      }, {
        "mediaName": "媒体名称",
        "mediaId": 5,
        "occupancyRatio": "13.00",   //当前媒体受众综合占比
        "contactRatio": [           //关联媒体
          {
            "mediaName": "京东",
            "ratio": 34.13,
          },
          {
            "mediaName": "淘宝",
            "ratio": 12.40,
          }],
        "audiencesRatio": [         //受众占比
          {
            "name": "人群-13",
            "ratio": 12.42
          },
          {
            "name": "人群-2",
            "ratio": 43.01
          }],
        "label":
          {
            "city":
              {
                "北京": "1.67"
              },
            "type":
              {
                "房产": "0.00",
                "应用商店": "0.01",
                "餐饮": "0.00",
                "汽车服务": "0.00",
                "金融理财": "0.02",
                "工具": "0.26",
                "人力资源": "0.00",
                "健康美容": "0.00",
                "阅读": "0.01",
                "母婴": "0.00",
                "unknown": "0.31",
                "网络购物": "0.00",
                "新闻": "0.01",
                "音乐": "0.08",
                "社区服务": "0.00",
                "视频": "0.01",
                "O2O": "0.00",
                "医疗": "0.00",
                "通讯社交": "0.04",
                "分类信息": "0.00",
                "游戏": "0.00",
                "图片摄影": "0.00",
                "智能硬件": "0.00",
                "快递物流": "0.00",
                "地图导航": "0.02",
                "出行": "0.00",
                "旅游": "0.00",
                "教育": "0.01"
              },
            "marriage":
              {
                "已婚": "10.75"
              },
            "age":
              {
                "26-35岁": "11.07"
              },
            "gender":
              {
                "男": "8.82"
              },
            "cars":
              {
                "有车": "4.40"
              },
            "carrier":
              {
                "中国移动": "0.00"
              },
            "net":
              {
                "WIFI": "1.67"
              }
          },
        "tgi":
          {
            "media":               //媒体特征
              {
                "已婚": "0.00",
                "男": "32.44",
                "有车": "0.00",
                "中国移动": "0.00",
                "WIFI": "0.00",
                "19-25岁": "0.00",
                "北京": "83.70"
              },
            "type":                //应用分类
              {
                "房产": "0.00",
                "应用商店": "165.38",
                "餐饮": "0.00",
                "汽车服务": "0.00",
                "金融理财": "110.26",
                "工具": "100.00",
                "人力资源": "0.00",
                "健康美容": "0.00",
                "阅读": "165.38",
                "母婴": "0.00",
                "unknown": "96.73",
                "网络购物": "0.00",
                "新闻": "165.38",
                "音乐": "94.51",
                "社区服务": "0.00",
                "视频": "165.38",
                "O2O": "0.00",
                "医疗": "0.00",
                "通讯社交": "94.51",
                "分类信息": "0.00",
                "游戏": "0.00",
                "图片摄影": "0.00",
                "智能硬件": "0.00",
                "快递物流": "0.00",
                "地图导航": "82.69",
                "出行": "0.00",
                "旅游": "0.00",
                "教育": "165.38"
              },
          }
      }, {
        "mediaName": "媒体名称",
        "mediaId": 6,
        "occupancyRatio": "37.00",   //当前媒体受众综合占比
        "contactRatio": [           //关联媒体
          {
            "mediaName": "京东",
            "ratio": 34.13,
          },
          {
            "mediaName": "淘宝",
            "ratio": 12.40,
          }],
        "audiencesRatio": [         //受众占比
          {
            "name": "人群-1",
            "ratio": 12.42
          },
          {
            "name": "人群-2",
            "ratio": 43.01
          }],
        "label":
          {
            "city":
              {
                "北京": "1.67"
              },
            "type":
              {
                "房产": "0.00",
                "应用商店": "0.01",
                "餐饮": "0.00",
                "汽车服务": "0.00",
                "金融理财": "0.02",
                "工具": "0.26",
                "人力资源": "0.00",
                "健康美容": "0.00",
                "阅读": "0.01",
                "母婴": "0.00",
                "unknown": "0.31",
                "网络购物": "0.00",
                "新闻": "0.01",
                "音乐": "0.08",
                "社区服务": "0.00",
                "视频": "0.01",
                "O2O": "0.00",
                "医疗": "0.00",
                "通讯社交": "0.04",
                "分类信息": "0.00",
                "游戏": "0.00",
                "图片摄影": "0.00",
                "智能硬件": "0.00",
                "快递物流": "0.00",
                "地图导航": "0.02",
                "出行": "0.00",
                "旅游": "0.00",
                "教育": "0.01"
              },
            "marriage":
              {
                "已婚": "10.75"
              },
            "age":
              {
                "26-35岁": "11.07"
              },
            "gender":
              {
                "男": "8.82"
              },
            "cars":
              {
                "有车": "4.40"
              },
            "carrier":
              {
                "中国移动": "0.00"
              },
            "net":
              {
                "WIFI": "1.67"
              }
          },
        "tgi":
          {
            "media":               //媒体特征
              {
                "已婚": "0.00",
                "男": "32.44",
                "有车": "0.00",
                "中国移动": "0.00",
                "WIFI": "0.00",
                "19-25岁": "0.00",
                "北京": "83.70"
              },
            "type":                //应用分类
              {
                "房产": "0.00",
                "应用商店": "165.38",
                "餐饮": "0.00",
                "汽车服务": "0.00",
                "金融理财": "110.26",
                "工具": "100.00",
                "人力资源": "0.00",
                "健康美容": "0.00",
                "阅读": "165.38",
                "母婴": "0.00",
                "unknown": "96.73",
                "网络购物": "0.00",
                "新闻": "165.38",
                "音乐": "94.51",
                "社区服务": "0.00",
                "视频": "165.38",
                "O2O": "0.00",
                "医疗": "0.00",
                "通讯社交": "94.51",
                "分类信息": "0.00",
                "游戏": "0.00",
                "图片摄影": "0.00",
                "智能硬件": "0.00",
                "快递物流": "0.00",
                "地图导航": "82.69",
                "出行": "0.00",
                "旅游": "0.00",
                "教育": "165.38"
              },
          }
      }, {
        "mediaName": "媒体名称",
        "mediaId": 7,
        "occupancyRatio": "46.00",   //当前媒体受众综合占比
        "contactRatio": [           //关联媒体
          {
            "mediaName": "京东",
            "ratio": 34.13,
          },
          {
            "mediaName": "淘宝",
            "ratio": 12.40,
          }],
        "audiencesRatio": [         //受众占比
          {
            "name": "人群-1",
            "ratio": 12.42
          },
          {
            "name": "人群-2",
            "ratio": 43.01
          }],
        "label":
          {
            "city":
              {
                "北京": "1.67"
              },
            "type":
              {
                "房产": "0.00",
                "应用商店": "0.01",
                "餐饮": "0.00",
                "汽车服务": "0.00",
                "金融理财": "0.02",
                "工具": "0.26",
                "人力资源": "0.00",
                "健康美容": "0.00",
                "阅读": "0.01",
                "母婴": "0.00",
                "unknown": "0.31",
                "网络购物": "0.00",
                "新闻": "0.01",
                "音乐": "0.08",
                "社区服务": "0.00",
                "视频": "0.01",
                "O2O": "0.00",
                "医疗": "0.00",
                "通讯社交": "0.04",
                "分类信息": "0.00",
                "游戏": "0.00",
                "图片摄影": "0.00",
                "智能硬件": "0.00",
                "快递物流": "0.00",
                "地图导航": "0.02",
                "出行": "0.00",
                "旅游": "0.00",
                "教育": "0.01"
              },
            "marriage":
              {
                "已婚": "10.75"
              },
            "age":
              {
                "26-35岁": "11.07"
              },
            "gender":
              {
                "男": "8.82"
              },
            "cars":
              {
                "有车": "4.40"
              },
            "carrier":
              {
                "中国移动": "0.00"
              },
            "net":
              {
                "WIFI": "1.67"
              }
          },
        "tgi":
          {
            "media":               //媒体特征
              {
                "已婚": "0.00",
                "男": "32.44",
                "有车": "0.00",
                "中国移动": "0.00",
                "WIFI": "0.00",
                "19-25岁": "0.00",
                "北京": "83.70"
              },
            "type":                //应用分类
              {
                "房产": "0.00",
                "应用商店": "165.38",
                "餐饮": "0.00",
                "汽车服务": "0.00",
                "金融理财": "110.26",
                "工具": "100.00",
                "人力资源": "0.00",
                "健康美容": "0.00",
                "阅读": "165.38",
                "母婴": "0.00",
                "unknown": "96.73",
                "网络购物": "0.00",
                "新闻": "165.38",
                "音乐": "94.51",
                "社区服务": "0.00",
                "视频": "165.38",
                "O2O": "0.00",
                "医疗": "0.00",
                "通讯社交": "94.51",
                "分类信息": "0.00",
                "游戏": "0.00",
                "图片摄影": "0.00",
                "智能硬件": "0.00",
                "快递物流": "0.00",
                "地图导航": "82.69",
                "出行": "0.00",
                "旅游": "0.00",
                "教育": "165.38"
              },
          }
      }, {
        "mediaName": "媒体名称",
        "mediaId": 8,
        "occupancyRatio": "12.00",   //当前媒体受众综合占比
        "contactRatio": [           //关联媒体
          {
            "mediaName": "京东",
            "ratio": 34.13,
          },
          {
            "mediaName": "淘宝",
            "ratio": 12.40,
          }],
        "audiencesRatio": [         //受众占比
          {
            "name": "人群-1",
            "ratio": 12.42
          },
          {
            "name": "人群-2",
            "ratio": 43.01
          }],
        "label":
          {
            "city":
              {
                "北京": "1.67"
              },
            "type":
              {
                "房产": "0.00",
                "应用商店": "0.01",
                "餐饮": "0.00",
                "汽车服务": "0.00",
                "金融理财": "0.02",
                "工具": "0.26",
                "人力资源": "0.00",
                "健康美容": "0.00",
                "阅读": "0.01",
                "母婴": "0.00",
                "unknown": "0.31",
                "网络购物": "0.00",
                "新闻": "0.01",
                "音乐": "0.08",
                "社区服务": "0.00",
                "视频": "0.01",
                "O2O": "0.00",
                "医疗": "0.00",
                "通讯社交": "0.04",
                "分类信息": "0.00",
                "游戏": "0.00",
                "图片摄影": "0.00",
                "智能硬件": "0.00",
                "快递物流": "0.00",
                "地图导航": "0.02",
                "出行": "0.00",
                "旅游": "0.00",
                "教育": "0.01"
              },
            "marriage":
              {
                "已婚": "10.75"
              },
            "age":
              {
                "26-35岁": "11.07"
              },
            "gender":
              {
                "男": "8.82"
              },
            "cars":
              {
                "有车": "4.40"
              },
            "carrier":
              {
                "中国移动": "0.00"
              },
            "net":
              {
                "WIFI": "1.67"
              }
          },
        "tgi":
          {
            "media":               //媒体特征
              {
                "已婚": "0.00",
                "男": "32.44",
                "有车": "0.00",
                "中国移动": "0.00",
                "WIFI": "0.00",
                "19-25岁": "0.00",
                "北京": "83.70"
              },
            "type":                //应用分类
              {
                "房产": "0.00",
                "应用商店": "165.38",
                "餐饮": "0.00",
                "汽车服务": "0.00",
                "金融理财": "110.26",
                "工具": "100.00",
                "人力资源": "0.00",
                "健康美容": "0.00",
                "阅读": "165.38",
                "母婴": "0.00",
                "unknown": "96.73",
                "网络购物": "0.00",
                "新闻": "165.38",
                "音乐": "94.51",
                "社区服务": "0.00",
                "视频": "165.38",
                "O2O": "0.00",
                "医疗": "0.00",
                "通讯社交": "94.51",
                "分类信息": "0.00",
                "游戏": "0.00",
                "图片摄影": "0.00",
                "智能硬件": "0.00",
                "快递物流": "0.00",
                "地图导航": "82.69",
                "出行": "0.00",
                "旅游": "0.00",
                "教育": "165.38"
              },
          }
      },
    ]
  private customerData: any = [];
  private data: any =
    [
      // {
      //   title: '乐视视频1',
      //   info: '目标受众综合占比',
      //   content: '56.3%'
      // },
      // {
      //   title: '乐视视频1',
      //   info: '目标受众综合占比',
      //   content: '56.3%'
      // },
      // {
      //   title: '乐视视频2',
      //   info: '目标受众综合占比',
      //   content: '56.3%'
      // },
      // {
      //   title: '乐视视频3',
      //   info: '目标受众综合占比',
      //   content: '56.3%'
      // },
      // {
      //   title: '乐视视频4',
      //   info: '目标受众综合占比',
      //   content: '56.3%'
      // },
      // {
      //   title: '乐视视频5',
      //   info: '目标受众综合占比',
      //   content: '56.3%'
      // },
      // {
      //   title: '乐视视频6',
      //   info: '目标受众综合占比',
      //   content: '56.3%'
      // },
      // {
      //   title: '乐视视频7',
      //   info: '目标受众综合占比',
      //   content: '56.3%'
      // },
    ];
  private isCheck: number = 0;
  // 表格数据
  private tabData: any = []
  // 雷达图
  private radarConfig: any = {
    radar: {
      indicator: [
      ],
    },
    series: {
      data: [
        {
          value: [],
          name: 'Chars Bosh',
        },
      ],
    }
  };
  private radar: any = {
    radar: {
      indicator: [
      ],
    },
    series: {
      data: [
        {
          value: [],
          name: 'Chars Bosh',
        },
      ],
    }
  };
  // metric
  private metricData: any = [];
  private metric: any = [];
  // 环状进度条Data
  private progressValue: any
  // 状态管理
  private _store: any;
  constructor(
    private store$: Store<reducer.State>,
  ) {
    this._store = this.store$.select('global').debounceTime(1000).distinctUntilChanged().subscribe(result => {
      console.log(result.mediaExploreId)
    })
  }
  ngOnInit() {
    this.totalData.map((item: any) => {
      this.data.push({
        title: item.mediaName,
        info: '目标受众综合占比',
        content: item.occupancyRatio,
      })
    })
    this.handleData(this.totalData[0])
  }

  ngOnDestroy() {
    this._store.unsubscribe();
  }
  // slider切换
  checked(e: any) {
    this.handleData(this.totalData[e])
  }

  handleData(currentData: any) {
    this.metricData = []; this.metric = [];
    let raderName: any = [], raderData: any = [],
      raderName1: any = [], raderData1: any = [];
    this.progressValue = currentData.occupancyRatio
    // tableData
    this.tabData = currentData.contactRatio;
    // 人群Data
    this.customerData = currentData.audiencesRatio;
    // metricData 
    for (let key in currentData.label) {
      if (key == 'type') {
        for (let v in currentData.label[key]) {
          this.metricData.push({
            name: v,
            pre: currentData.label[key][v]
          })
        }
      } else {
        for (let k in currentData.label[key]) {
          this.metric.push({
            name: k,
            pre: currentData.label[key][k]
          })
        }
      }
    }
    // raderData
    for (let key in currentData.tgi) {
      if (key === 'media') {
        for (let k in currentData.tgi[key]) {
          raderName.push({
            name: k,
            max: 100,
          })
          raderData.push(currentData.tgi[key][k])
        }
      } else {
        for (let k in currentData.tgi[key]) {
          raderName1.push({
            name: k,
            max: 200,
          })
          raderData1.push(currentData.tgi[key][k])
        }
      }
    }

    this.radarConfig.radar.indicator = raderName;
    this.radarConfig.series.data[0].value = raderData;
    this.radar.radar.indicator = raderName1;
    this.radar.series.data[0].value = raderData1;
  }
}