#!/bin/bash
basedir=$(cd "$(dirname "$0")"; pwd)
#地理位置接口
#按照城市级别进行调用，然后把结果和每个项目人群offset进行相交来获取
source $basedir/env.sh
source $basedir/func.sh

function usage() {
  echo "Usage: $0 [-runDate] "
  echo " -runDate yyyy-MM-dd"
}

# if no args specified, show usage
if [ $# -le 0 ]; then
  usage
  exit 1
fi

#默认运行全部城市、全部项目
cityNames="-1"
projectIds="-1"
startDate="-1"
endDate="-1"
while true; do
  if [ $# == 0 ]; then
    break
  fi
  case "$1" in
  (--runDate|-runDate)
      runDate="$2"
      shift 2
      ;;
  (--startDate|-startDate)
      startDate="$2"
      shift 2
      ;;
  (--endDate|-endDate)
      endDate="$2"
      shift 2
      ;;
  (--cityNames|-cityNames)
      cityNames="$2"
      shift 2
      ;;
  (--projectIds|-projectIds)
      projectIds="$2"
      shift 2
      ;;
  (--schedulerTaskLogId|-schedulerTaskLogId)
     schedulerTaskLogId="$2"
     shift 2
     ;;
  (*)
      usage
      exit 1
  esac
done

calcObjectCode="PositionTask"
calcObjectName="地理位置计算任务"

#判断本计算对象是否需要skip
calcObjectIsNeedSkip $schedulerTaskLogId $calcObjectCode

if [ $isCalcObjectSkip -eq 1 ]; then
  #生成计算对象，设置计算对象状态为skip
  skipExecCalcObject $schedulerTaskLogId $calcObjectCode $calcObjectName
  exit 0
fi

#判断本计算对象是否需要stop
schedulerTaskIsNeedStop $schedulerTaskLogId $calcObjectCode

if [ $isStop -eq 1 ]; then
  #生成计算对象，设置计算对象状态为stop
  stopExecCalcObject $schedulerTaskLogId $calcObjectCode $calcObjectName
  exit 0
fi

#生成计算对象
generateCalcObjectLog $schedulerTaskLogId $calcObjectCode $calcObjectName

echo "<<etl exec>> $calcObjectName($calcObjectCode) exec starting..."

#建表用到的日期，除去中划线
tmpRunDate=${runDate//-/}

tmpOffsetPath=$tmpDataBaseDir/position_offset_$runDate
#生成按照城市级别mac文件 文件
#生产临时目录
mkdir -p $tmpOffsetPath

#生成城市人群offset信息
outputFile=$tmpOffsetPath/position_city_offset_$tmpRunDate

#生成城市范围内用户mac文件以及每个店铺每天每个人群分类的用户mac文件
java -classpath .:$basedir/../libs/* td.enterprise.wanalytics.etl.task.position.CreateCityProjectOffsetTask --runDate "$runDate" --startDate "$startDate" --endDate "$endDate" --cityNames "$cityNames" --projectIds "$projectIds" --outputFile "$outputFile"
if [ $? -ne 0 ];then
  content="生成城市以及项目人群mac offset文件失败"
  finishCalcObjectLogWithExcetpion ${calcObjectLogId} ${content}
  exit 1
fi

#根据tdid 逐个进行调用地理位置接口
while read line
      do
       #根据第一个类型进行判断
        type=`echo "$line" | awk -F ',' '{print $1}'`
        cityHashCode=`echo "$line" | awk -F ',' '{print $2}'`
        if [ "$type" == "city" ] ; then
            echo "城市级别:type=$type"
            cycle=`echo "$line" | awk -F ',' '{print $5}'`
            macFile="$tmpOffsetPath/${cityHashCode}_${cycle}_mac"
            areaFile="$tmpOffsetPath/${cityHashCode}_${cycle}_area"
        fi

        if [ "$type" == "crowd" ] ; then
            echo "案场人群级别:type=$type"
            projectId=`echo "$line" | awk -F ',' '{print $4}'`
            crowdId=`echo "$line" | awk -F ',' '{print $5}'`
            cycle=`echo "$line" | awk -F ',' '{print $6}'`
            macFile="$tmpOffsetPath/${projectId}_${crowdId}_${cycle}_mac"
        fi

        #判断文件不存在，忽略执行
        if [ ! -s "$macFile" ]; then
           echo "${macFile}文件为空,忽略执行"
           continue;
        fi

        echo "$macFile 文件存在！"

        echo "type=$type"
        if [ "$type" == "city" ] ; then
            cityName=`echo "$line" | awk -F ',' '{print $3}'`
            echo "调用城市位置信息开始 cityHashCode=$cityHashCode cityName=$cityName"
            subCalcObjectCode="PositionGetTask_${tmpRunDate}"
            subCalcObjectName="PositionGetTask"
            bash -x ${basedir}/PositionTask/PositionGetTask.sh  --macFile ${macFile} --cityName ${cityName} --cityHashCode ${cityHashCode} --runDate ${runDate} --schedulerTaskLogId ${schedulerTaskLogId}  --calcObjectLogId $calcObjectLogId
            result=$?
            if [ $result -eq 1 ]; then
              echo "<<etl exec>> Exception: $subCalcObjectName($subCalcObjectCode) calculate failed!!!"
              finishCalcObjectLogWithExcetpion $calcObjectLogId ""
              echo "$subCalcObjectName($subCalcObjectCode) exit with exception!!!"
              exit 1
            fi
            echo "调用城市位置信息结束 cityHashCode=$cityHashCode cityName=$cityName"

            # 根据用户mac地址，计算用户活动区域top10--1. 城市范围用户计算. 从输入文件macFile中读取一个城市中所有用户mac信息，然后调用DMK接口获取用户的夜间活动的top3的小区和城市行政区域名字，并写入hive表中准备计算
            echo "开始执行获取用户的夜间活动的top3位置服务 cityHashCode=$cityHashCode cityName=$cityName"
            subCalcObjectCode="ProjectCityUserAreaToHiveTask_${cityName}_${tmpRunDate}"
            subCalcObjectName="ProjectCityUserAreaToHiveTask"
            echo "macFile=${macFile} areaFile=${areaFile} cityName=${cityName} cityHashCode=${cityHashCode} runDate=${tmpRunDate}"
            bash -x ${basedir}/PositionTask/ProjectCityUserAreaToHiveTask.sh  --macFile ${macFile} --outputFile ${areaFile} --cityName ${cityName} --cityHashCode ${cityHashCode} --runDate ${tmpRunDate} --schedulerTaskLogId ${schedulerTaskLogId}  --calcObjectLogId ${calcObjectLogId}
            result=$?
            if [ $result -eq 1 ]; then
              echo "<<etl exec>> Exception: $subCalcObjectName($subCalcObjectCode) calculate failed!!!"
              finishCalcObjectLogWithExcetpion $calcObjectLogId ""
              echo "$subCalcObjectName($subCalcObjectCode) exit with exception!!!"
              exit 1
            fi
            echo "DMK接口获取用户的夜间活动的top3的小区结束 cityHashCode=$cityHashCode cityName=$cityName"
        fi

        if [ "$type" == "crowd" ] ; then
            echo "处理项目人群位置信息开始"
            tenantId=`echo "$line" | awk -F ',' '{print $3}'`
            projectId=`echo "$line" | awk -F ',' '{print $4}'`
            crowdId=`echo "$line" | awk -F ',' '{print $5}'`
            cycle_statistics=`echo "$line" | awk -F ',' '{print $6}'`
            runDate=`echo "$line" | awk -F ',' '{print $7}'`
            startDate=`echo "$line" | awk -F ',' '{print $8}'`
            endDate=`echo "$line" | awk -F ',' '{print $9}'`
            crowdType=`echo "$line" | awk -F ',' '{print $10}'`
            cityName=`echo "$line" | awk -F ',' '{print $11}'`
            crowdName=`echo "$line" | awk -F ',' '{print $12}'`
            crowdNum=`echo "$line" | awk -F ',' '{print $13}'`

            subCalcObjectCode="PositionCountAndSurroundingTask_${crowdId}_${cycle_statistics}_${runDate}"
            subCalcObjectName="PositionCountAndSurroundingTask"
            if [ "$crowdType" != "TU" ];then
            	bash -x ${basedir}/PositionTask/PositionCountAndSurroundingTask.sh --cityName $cityName  --macFile $macFile --cityHashCode ${cityHashCode} --tenantId ${tenantId} --projectId ${projectId} --crowdId ${crowdId} --runDate ${runDate} --cycle_statistics ${cycle_statistics} --schedulerTaskLogId ${schedulerTaskLogId}  --startDate ${startDate}  --endDate ${endDate} --calcObjectLogId $calcObjectLogId --subCalcObjectCode ${subCalcObjectCode} --subCalcObjectName ${subCalcObjectName}
                result=$?
	            if [ $result -eq 1 ]; then
	                echo "<<etl exec>> Exception: $subCalcObjectName($subCalcObjectCode) calculate failed!!!"
	                finishCalcObjectLogWithExcetpion $calcObjectLogId ""
	                echo "$subCalcObjectName($subCalcObjectCode) exit with exception!!!"
	                exit 1
	            fi
            fi

            # 根据用户mac地址，计算用户活动区域top10. 店铺中某个人群范围用户mac. 根据人群类型，将店铺一个人群类型的用户mac文件导入hive表中，并且与店铺所在城市的hive表进行联表查询，然后将结果导入mysql中 TD_TENANT_TOP_AREA_COUNT表
            subCalcObjectCode="ProjectCrowdUserAreaToHiveTask_${projectId}_${crowdId}_${runDate}"
            subCalcObjectName="ProjectCrowdUserAreaToHiveTask"
            echo "--macFile ${macFile} --cityName ${cityName} --tenantId ${tenantId} --projectId ${projectId} --crowdId ${crowdId} --crowdType ${crowdType} --cityHashCode ${cityHashCode} --runDate ${runDate} --startDate ${startDate} --endDate ${endDate}"
            bash -x ${basedir}/PositionTask/ProjectCrowdUserAreaToHiveTask.sh  --macFile ${macFile} --cityName ${cityName} --tenantId ${tenantId} --projectId ${projectId} --crowdId ${crowdId} --crowdType ${crowdType} --crowdName ${crowdName} --cityHashCode ${cityHashCode} --runDate ${runDate} --startDate ${startDate} --endDate ${endDate} --schedulerTaskLogId ${schedulerTaskLogId}  --calcObjectLogId $calcObjectLogId
            result=$?
            if [ $result -eq 1 ]; then
              echo "<<etl exec>> Exception: $subCalcObjectName($subCalcObjectCode) calculate failed!!!"
              finishCalcObjectLogWithExcetpion ${calcObjectLogId} ""
              echo "$subCalcObjectName($subCalcObjectCode) exit with exception!!!"
              exit 1
            fi

            subCalcObjectCode="PositionDistanceTask_${crowdId}_${cycle_statistics}_${runDate}"
            subCalcObjectName="PositionDistanceTask"
            bash -x ${basedir}/PositionTask/PositionDistanceTask.sh --macFile $macFile --cityHashCode ${cityHashCode} --tenantId ${tenantId} --projectId ${projectId} --crowdId ${crowdId} --runDate ${runDate} --cycle_statistics ${cycle_statistics} --schedulerTaskLogId ${schedulerTaskLogId}  --startDate ${startDate}  --endDate ${endDate} --calcObjectLogId $calcObjectLogId --subCalcObjectCode ${subCalcObjectCode} --subCalcObjectName ${subCalcObjectName}  --crowdType $crowdType --crowdName $crowdName --crowdNum $crowdNum
        fi

done < "$outputFile"

finishCalcObjectLogWithSuccess $calcObjectLogId
echo "<<etl exec>> $calcObjectName($calcObjectCode) exec finished."
exit 0
