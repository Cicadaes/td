//package com.talkingdata.marketing.entity
//
//import java.io.OutputStream
//
//import com.fasterxml.jackson.annotation.JsonIgnoreProperties
//
///**
//  * Created by tend on 2017/11/22.
//  */
//
//@JsonIgnoreProperties(ignoreUnknown = true)
//case class EventPackage(
//                         var mDeviceId: String = "",
//
//                         /**
//                           * 开发这的App key
//                           */
//                         var mDeveploperAppkey: String = "",
//
//                         /**
//                           * 应用的Profile
//                           */
//                         var mAppProfile: AppProfile = new AppProfile,
//
//                         /**
//                           * Server要求每次交互都上传的信息
//                           */
//                         var mDeviceProfile: DeviceProfile = new DeviceProfile,
//
//                         /**
//                           * 事件List
//                           */
//                         var mTMessages: List[TMessage] = null,
//                         var activeApps: List[Array[Long]] = null,
//                         var ip: String = null,
//                         // TODO 采集时间的毫秒值
//                         var rectime: Long = 0,
//
//                         /**
//                           * 附加属性对象
//                           */
//                         var additiveProfile: AdditiveProfile = new AdditiveProfile,
//
//                         /**
//                           * 用户的Profile
//                           */
//                         var userProfile: UserProfile = new UserProfile
//                       )
//
//@JsonIgnoreProperties(ignoreUnknown = true)
//case class Activity(
//                     /**
//                       * Activity的名字
//                       */
//                     var name: String = "",
//
//                     /**
//                       * 启动时间
//                       */
//                     var start: Long = 0L,
//
//                     /**
//                       * 持续时间
//                       */
//                     var duration: Int = 0,
//
//                     /**
//                       * 调用者页面
//                       */
//                     var refer: String = "")
//
//@JsonIgnoreProperties(ignoreUnknown = true)
//case class AdditiveProfile(
//                            // TODO offset 需要数据中给到
//                            var offset: Integer = -1,
//                            // TODO 通过上一个节点的时间
//                            var passBeforeNodeTime: Long = 0L,
//                            // TODO 活动ID
//                            var campaignId: Integer = null,
//                            // TODO 人群ID
//                            var crowdId: Integer = null,
//                            // TODO pipeline定义ID
//                            var pipelineDefinitionId: Integer = null,
//                            // TODO 版本信息
//                            var version: String = null,
//                            // TODO Pipeline执行的上一个stage的stageName
//                            var stageName: String = null,
//                            var nextTriggerTime: String = null
//                          )
//
//@JsonIgnoreProperties(ignoreUnknown = true)
//case class AppEvent(
//                     /**
//                       * 开发者自定义事件的ID
//                       */
//                     var id: String = "",
//                     var label: String = "",
//                     var count: Int = 0,
//                     var startTime: Long = 0L,
//                     var parameters: Map[String, AnyRef] = null
//                   )
//
//@JsonIgnoreProperties(ignoreUnknown = true)
//case class AppException(
//                         //异常发生事件
//                         var mErrorTime: Long = 0L,
//                         //异常发生次数
//                         var mRepeat: Int = 0,
//                         //应用版本号
//                         var mAppVersionCode: String = "",
//                         //异常栈信息
//                         var data: Array[Byte],
//                         var mShortHashCode: String = ""
//                       )
//
//@JsonIgnoreProperties(ignoreUnknown = true)
//case class AppProfile(
//                       /**
//                         * 应用包名称
//                         */
//                       var mAppPackageName: String = "",
//
//                       /**
//                         * 应用版本名称如：疯狂的小鸟太空版
//                         */
//                       var mAppVersionName: String = "",
//
//                       /**
//                         * 应用版本号
//                         */
//                       var mAppVersionCode: String = "",
//
//                       /**
//                         * App启动时间
//                         */
//                       var mStartTime: Long = 0L,
//
//                       /**
//                         * TC SDK 版本号
//                         */
//                       var mSdkVersion: String = "",
//
//                       /**
//                         * 渠道ID
//                         */
//                       var mPartnerId: String = "",
//
//                       /**
//                         * for collector
//                         */
//                       var isCracked: Boolean = false,
//
//                       var installationTime: Long = 0,
//
//                       var purchaseTime: Long = 0,
//
//                       // 对应1.5版本修改，只有ios会用到此字段
//                       var appStoreID: Long = 0L
//
//                     )
//
//
//@JsonIgnoreProperties(ignoreUnknown = true)
//case class DeviceProfile(
//                          /**
//                            * 手机型号
//                            */
//                          var mMobileModel: String = "",
//
//                          /**
//                            * SDK Version, e.g: 7,8,9,11
//                            */
//                          var mOsSdkVersion: String = "",
//
//                          /**
//                            * 位置信息
//                            */
//                          var mGis: Gis = new Gis,
//
//                          /**
//                            * Cpu
//                            */
//                          var mCpuABI: String = "",
//
//                          /**
//                            * 分辨率
//                            */
//                          var mPixelMetric: String = "",
//
//                          /**
//                            * 国家
//                            */
//                          var mCountry: String = "",
//
//                          /**
//                            * 运营商
//                            */
//                          var mCarrier: String = "",
//
//                          /**
//                            * 语言
//                            */
//                          var mLanguage: String = "",
//
//                          /**
//                            * 时区
//                            */
//                          var mTimezone: Int = 0,
//
//                          /**
//                            * 手机操作系统版本
//                            */
//                          var mOsVersion: String = "",
//
//                          /**
//                            * 是否是Wifi连接, 0表示是Wifi连接，1表示2G/3G
//                            */
//                          var mChannel: Int = -(1),
//                          //在不是Wifi连接时有意义
//                          var m2G_3G: String = "",
//
//                          /**
//                            * for collector
//                            */
//                          var isJailBroken: Boolean = false,
//                          var mSimOperator: String = "",
//                          var mNetworkOperator: String = "",
//                          var hostName: String = "",
//                          var deviceName: String = "",
//                          var kernBootTime: Long = 0,
//                          // 对应1.5版本修改
//                          var advertisingID: String = null,
//                          // 对应1.5版本第二次修改<增加地理位置信息>
//                          var mWifiBSSID: String = null,
//                          var mMobileNetType: String = null,
//                          var mCellID: Int = 0,
//                          var mLac: Int = 0
//                        )
//
//@JsonIgnoreProperties(ignoreUnknown = true)
//case class Gis(
//                /**
//                  * 经度
//                  */
//                var lng: Double = .0,
//
//                /**
//                  * 纬度
//                  */
//                var lat: Double = .0
//              )
//
//
//@JsonIgnoreProperties(ignoreUnknown = true)
//case class InitProfile(
//                        /**
//                          * 手机的CPU信息
//                          */
//                        var mCpuDiscription: String = "",
//
//                        //CPU核数
//                        var mCpuCoreNum: Int = 0,
//                        //主频，单位MHz
//                        var mCpuFrequency: Float = 0,
//                        //CPU implementor
//                        var mCpuImplementor: String = "",
//
//                        /*
//                         * 手机GPU信息
//                         */ var mGpuVendor: String = "",
//                        var mGpuRenderer: String = "",
//                        /*
//                         * 手机RAM信息,KB
//                         */ var mMemoryTotal: Int = 0,
//                        var mMemoryFree: Int = 0,
//                        /*
//                         * 机身存储
//                         */ var mMobileStorageTotal: Int = 0,
//                        var mMobileStorageFree: Int = 0,
//                        //SD 卡
//                        var mSDCardStorageTotal: Int = 0,
//                        var mSDCardStorageFree: Int = 0,
//
//                        //电量mAh
//                        var mBatteryCapacity: Int = 0,
//
//                        /**
//                          * dpi 及物理尺寸单位英尺
//                          */
//                        var mDisplaMetricWidth: Float = 0,
//                        var mDisplaMetricHeight: Float = 0,
//                        var mDisplayMetricDensity: Int = 0,
//
//                        //手机rom版本
//                        var mRomInfo: String = "",
//                        //基带版本
//                        var mBaseBand: String = "",
//
//                        //手机的IMEI或MAC地址如果可以拿到的话
//                        var mIMEI: String = "",
//                        var mMACAddress: String = "",
//
//                        //默认接入点相关设定
//                        var mApnName: String = "",
//                        var mApn_mcc: String = "",
//                        var mApn_mnc: String = "",
//
//                        var mApn_proxy: Boolean = false,
//
//                        var mIMSI: String = "",
//
//                        var mUpid: String = "",
//
//                        var mSimId: String = "",
//
//                        var mAndroidId: String = "", // added 2015/10/16
//
//
//                        var mNfcHce: String = ""
//                      )
//
//
//object Printag {
//  val SPACE = "    "
//  val STARTAG = "--<"
//  val LISTSTARTAG = "--["
//  val LISTENDTAG = "]\r\n"
//  val ENDTAG = ">\r\n"
//  val OBJSTARTAG = "=@"
//  val OBJENDTAG = "\r\n"
//}
//
//
//@JsonIgnoreProperties(ignoreUnknown = true)
//case class Session(
//                    /**
//                      * Session id
//                      */
//                    var id: String = "",
//
//                    /**
//                      * Session的开始时间
//                      */
//                    var start: Long = 0L,
//
//                    // Session Status: 1: launch 2:continue 3:terminate
//                    var mStatus: Int = 0,
//
//                    /**
//                      * launch 为true,存储使用间隔 Terminate事件，存储session持续时间
//                      */
//                    var duration: Int = 0,
//
//                    /**
//                      * Activity List
//                      */
//                    var activities: List[Activity] = null,
//
//                    /**
//                      * AppEvent List
//                      */
//                    var appEvents: List[AppEvent] = null,
//
//                    var isConnected: Int = 0,
//
//                    var mLastSessionInterval: Int = 0
//                  )
//
//
//@JsonIgnoreProperties(ignoreUnknown = true)
//case class TMessage(
//                     /**
//                       * 事件类型
//                       * <p/>
//                       * 1.init事件：在App第一次启动（也就是我们的api被某个app第一次调用）的时候触发，devId也是在此时产生；
//                       * 事件数据应该包含设备的基本信息device profile和应用的基本信息app profile。
//                       * <p/>
//                       * 2.session事件，包含AppEvent和Activity相关的信息
//                       * 3.app_exception事件：用于上传应用的异常退出信息，异常信息可以通过data字段传输。
//                       * <p/>
//                       * 4.feedback事件：用于收集用户反馈，反馈信息可以通过data字段传输。
//                       * <p/>
//                       * 5.other事件：通用的事件，其事件的详细信息通过data字段来传输。
//                       */
//                     var mMsgType: Int = -(1),
//
//                     /**
//                       * Session
//                       */
//                     var session: Session = new Session(), // = new Session();
//
//
//                     var mInitProfile: InitProfile = null,
//
//                     var mAppException: AppException = null
//                   )
//
//
//@JsonIgnoreProperties(ignoreUnknown = true)
//case class UserProfile(
//                        /** 账户ID */
//                        var accountId: String = "",
//
//                        /** 租户 */
//                        var tenantId: String = "",
//
//                        /** 手机号 */
//                        var mobileId: String = "",
//
//                        /** 营其他自定义字段 */
//                        var profileMap: scala.collection.mutable.Map[String, AnyRef] = null
//                      )
//
//
//@JsonIgnoreProperties(ignoreUnknown = true)
//case class TDPacker(
//                     protected var castBytes: Array[Byte] = new Array[Byte](9),
//
//                     protected var out: OutputStream = null
//                   )
