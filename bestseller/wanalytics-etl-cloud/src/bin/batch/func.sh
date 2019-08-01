#!/bin/bash
set -o nounset
#set -o errexit

# SCRIPT: func.sh
# AUTHOR: tao.yang
# DATE: 2016.02.25
# REV: 3.0
# PLATFORM: Linux
# PURPOSE: 脚本埋点函数 

_url=http://localhost:9030/dmp-monitor/monitor

function schedulerTaskIsNeedStop() {
  echo "monitor url : $_url"
  echo "call schedulerTaskIsNeedStop($_schedulerTaskLogId)"
  _schedulerTaskLogId=$1
  echo 'curl -H "Content-Type:application/json" -X GET "$_url/schedulerTaskLogs/$_schedulerTaskLogId/isStopping"'
  while var=$(curl -H "Content-Type:application/json" -X GET "$_url/schedulerTaskLogs/$_schedulerTaskLogId/isStopping") || true; do
    isStop="$var" && break
  done
}

function generateCalcObjectLog() {
  echo "monitor url : $_url"
  _schedulerTaskLogId=$1
  _objectCode=$2
  _objectName=$3
  _objectType=$_objectCode  
  data="{\"objectType\":\"$_objectType\",\"objectName\":\"$_objectName\",\"objectCode\":\"$_objectCode\",\"schedulerTaskLogId\":\"$_schedulerTaskLogId\"}"
  echo 'generateCalcObjectLog data : ' $data
  echo curl -H "\"Content-Type:application/json\"" -X POST --data "${data}" "${_url}/calcObjectLogs/generateCalcObjectLog"
  while var=$(curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/calcObjectLogs/generateCalcObjectLog") || true; do
    calcObjectLogId="$var" && break
  done
}

#to be deleted
function finishCalcObjectLog() {
  echo "monitor url : $_url"
  _calcObjectLogId=$1
  _status=$2
  data="{\"id\":\"$_calcObjectLogId\",\"status\":$_status}"
  echo 'finishCalcObjectLog data : ' $data
  echo 'curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/calcObjectLogs/finishCalcObjectLog"'
  while var=$(curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/calcObjectLogs/finishCalcObjectLog") || true; do
    calcObjectLogId="$var" && break
  done
}

function finishCalcObjectLogWithSuccess() {
  echo "monitor url : $_url"
  _calcObjectLogId=$1
  _status=2
  data="{\"id\":\"$_calcObjectLogId\",\"status\":$_status}"
  echo 'finishCalcObjectLogWithSuccess data : ' $data
  echo 'curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/calcObjectLogs/finishCalcObjectLog"'
  while var=$(curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/calcObjectLogs/finishCalcObjectLog") || true; do
    calcObjectLogId="$var" && break
  done
}

function finishCalcObjectLogWithExcetpion() {
  echo "monitor url : $_url"
  _calcObjectLogId=$1
  _exceptionInfo=$2
  _status=-1
  data="{\"id\":\"$_calcObjectLogId\",\"status\":$_status}"
  echo 'finishCalcObjectLogWithExcetpion data : ' $data
  echo 'curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/calcObjectLogs/finishCalcObjectLog"'
  while var=$(curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/calcObjectLogs/finishCalcObjectLog") || true; do
    calcObjectLogId="$var" && break
  done
}

function calcObjectIsNeedSkip() {
  echo "monitor url : $_url"
  _schedulerTaskLogId=$1
  _objectCode=$2
  data="{\"objectCode\":\"$_objectCode\",\"schedulerTaskLogId\":\"$_schedulerTaskLogId\",\"status\":2}"
  echo 'calcObjectIsNeedSkip data : ' $data
  echo 'curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/calcObjectLogs/calcObjectIsNeedSkip"'
  while var=$(curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/calcObjectLogs/calcObjectIsNeedSkip") || true; do
    isCalcObjectSkip="$var" && break
  done
}

function skipExecCalcObject() {
  echo "monitor url : $_url"
  _schedulerTaskLogId=$1
  _objectCode=$2
  _objectName=$3
  _objectType=$_objectCode  
  data="{\"objectType\":\"$_objectType\",\"objectName\":\"$_objectName\",\"objectCode\":\"$_objectCode\",\"schedulerTaskLogId\":\"$_schedulerTaskLogId\"}"
  echo 'skipExecCalcObject data : ' $data
  echo curl -H "\"Content-Type:application/json\"" -X POST --data "${data}" "${_url}/calcObjectLogs/skipExecCalcObject"
  while var=$(curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/calcObjectLogs/skipExecCalcObject") || true; do
    calcObjectLogId="$var" && break
  done
}

function stopExecCalcObject() {
  echo "monitor url : $_url"
  _schedulerTaskLogId=$1
  _objectCode=$2
  _objectName=$3
  _objectType=$_objectCode  
  data="{\"objectType\":\"$_objectType\",\"objectName\":\"$_objectName\",\"objectCode\":\"$_objectCode\",\"schedulerTaskLogId\":\"$_schedulerTaskLogId\"}"
  echo 'stopExecCalcObject data : ' $data
  echo curl -H "\"Content-Type:application/json\"" -X POST --data "${data}" "${_url}/calcObjectLogs/stopExecCalcObject"
  while var=$(curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/calcObjectLogs/stopExecCalcObject") || true; do
    calcObjectLogId="$var" && break
  done
}

function generateSubCalcObjectLog() {
  echo "monitor url : $_url"
  _schedulerTaskLogId=$1
  _calcObjectLogId=$2
  _objectCode=$3
  _objectName=$4
  _objectType=$_objectCode
  data="{\"calcObjectLogId\":\"$_calcObjectLogId\",\"objectType\":\"$_objectType\",\"objectName\":\"$_objectName\",\"objectCode\":\"$_objectCode\",\"schedulerTaskLogId\":\"$_schedulerTaskLogId\"}"
  echo 'generateSubCalcObjectLog data : ' $data
  echo 'curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/subCalcObjectLogs/generateSubCalcObjectLog"'
  while var=$(curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/subCalcObjectLogs/generateSubCalcObjectLog") || true; do
    subCalcObjectLogId="$var" && break
  done
}

#to be deleted
function finishSubCalcObjectLog() {
  echo "monitor url : $_url"
  _subCalcObjectLogId=$1
  _content=$2
  _status=$3
  data="{\"content\":\"$_content\",\"id\":\"$_subCalcObjectLogId\",\"status\":$_status}"
  echo 'finishSubCalcObjectLog data : ' $data
  echo 'curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/subCalcObjectLogs/finishSubCalcObjectLog"'
  while var=$(curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/subCalcObjectLogs/finishSubCalcObjectLog") || true; do
    subCalcObjectLogId="$var" && break
  done
}

function finishSubCalcObjectLogWithSuccess() {
  echo "monitor url : $_url"
  _subCalcObjectLogId=$1
  _content=$2
  _status=2
  data="{\"content\":\"$_content\",\"id\":\"$_subCalcObjectLogId\",\"status\":$_status}"
  echo 'finishSubCalcObjectLog data : ' $data
  echo 'curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/subCalcObjectLogs/finishSubCalcObjectLog"'
  while var=$(curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/subCalcObjectLogs/finishSubCalcObjectLog") || true; do
    subCalcObjectLogId="$var" && break
  done
}

function finishSubCalcObjectLogWithException() {
  echo "monitor url : $_url"
  _subCalcObjectLogId=$1
  _content=$2
  _exceptionInfo=$3
  _status=-1  
  data="{\"content\":\"$_content\",\"id\":\"$_subCalcObjectLogId\",\"status\":$_status,\"execptionInfo\":\"$_exceptionInfo\"}"
  echo 'finishSubCalcObjectLog data : ' $data
  echo 'curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/subCalcObjectLogs/finishSubCalcObjectLog"'
  while var=$(curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/subCalcObjectLogs/finishSubCalcObjectLog") || true; do
    subCalcObjectLogId="$var" && break
  done
}

function subCalcObjectIsNeedSkip() {
  echo "monitor url : $_url"
  _schedulerTaskLogId=$1
  _calcObjectLogId=$2
  _objectCode=$3
  data="{\"calcObjectLogId\":\"$_calcObjectLogId\",\"schedulerTaskLogId\":\"$_schedulerTaskLogId\",\"objectCode\":\"$_objectCode\",\"status\":2}"
  echo 'subCalcObjectIsNeedSkip data : ' $data
  echo 'curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/subCalcObjectLogs/subCalcObjectIsNeedSkip"'
  while var=$(curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/subCalcObjectLogs/subCalcObjectIsNeedSkip") || true; do
    isSubCalcObjectSkip="$var" && break
  done
}


function skipExecSubCalcObject() {
  echo "monitor url : $_url"
  _schedulerTaskLogId=$1
  _calcObjectLogId=$2
  _objectCode=$3
  _objectName=$4
  _objectType=$_objectCode
  data="{\"calcObjectLogId\":\"$_calcObjectLogId\",\"objectType\":\"$_objectType\",\"objectName\":\"$_objectName\",\"objectCode\":\"$_objectCode\",\"schedulerTaskLogId\":\"$_schedulerTaskLogId\"}"
  echo 'skipExecSubCalcObject data : ' $data
  echo 'curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/subCalcObjectLogs/skipExecSubCalcObject"'
  while var=$(curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/subCalcObjectLogs/skipExecSubCalcObject") || true; do
    subCalcObjectLogId="$var" && break
  done
}

function stopExecSubCalcObject() {
  echo "monitor url : $_url"
  _schedulerTaskLogId=$1
  _calcObjectLogId=$2
  _objectCode=$3
  _objectName=$4
  _objectType=$_objectCode
  data="{\"calcObjectLogId\":\"$_calcObjectLogId\",\"objectType\":\"$_objectType\",\"objectName\":\"$_objectName\",\"objectCode\":\"$_objectCode\",\"schedulerTaskLogId\":\"$_schedulerTaskLogId\"}"
  echo 'stopExecSubCalcObject data : ' $data
  echo 'curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/subCalcObjectLogs/stopExecSubCalcObject"'
  while var=$(curl -H "Content-Type:application/json" -X POST --data "$data" "$_url/subCalcObjectLogs/stopExecSubCalcObject") || true; do
    subCalcObjectLogId="$var" && break
  done
}

#判断计算对象状态
#$schedulerTaskLogId $calcObjectCode $calcObjectName
function checkStatusCalcObject() {
  #判断本计算对象是否需要skip $schedulerTaskLogId $calcObjectCode
  calcObjectIsNeedSkip "$1" "$2" "$2"
  #isCalcObjectSkip=$?
  _checkStatusResuleVal=$isCalcObjectSkip
  echo "_checkStatusResuleVal : $_checkStatusResuleVal"
  if [ $isCalcObjectSkip -eq 1 ]; then
    echo " $schedulerTaskLogId $calcObjectCode [ skiped ]"
    #生成计算对象，设置计算对象状态为skip $schedulerTaskLogId $calcObjectCode $calcObjectName
    skipExecCalcObject "$1" "$2" "$3"
    #_checkStatusResuleVal=0
    return;
  fi

  #判断本计算对象是否需要stop $schedulerTaskLogId $calcObjectCode
  schedulerTaskIsNeedStop "$1" "$2"
  _checkStatusResuleVal=$isStop
  echo "_checkStatusResuleVal : $_checkStatusResuleVal"
  if [ $isStop -eq 1 ]; then
    echo " $schedulerTaskLogId $calcObjectCode [ stop ]"
    #生成计算对象，设置计算对象状态为stop $schedulerTaskLogId $calcObjectCode $calcObjectName
    stopExecCalcObject "$1" "$2" "$3"
    #_checkStatusResuleVal=0
    return;
  fi
}

#判断计算子对象状态
#$schedulerTaskLogId $calcObjectLogId $subCalcObjectCode $subCalcObjectName
function checkStatusSubCalcObject() {
  #判断本子计算对象是否需要skip $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode
  subCalcObjectIsNeedSkip "$1" "$2" "$3"
  _checkSubStatusResuleVal=$isSubCalcObjectSkip
  echo "_checkSubStatusResuleVal : $_checkSubStatusResuleVal"
  if [ $isSubCalcObjectSkip -eq 1 ]; then
    #生成子计算对象，设置子计算对象状态为skip $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode $subCalcObjectName
    echo " $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode $subCalcObjectName [ skiped ]"
    skipExecSubCalcObject "$1" "$2" "$3" "$4"
    return;
    #_checkSubStatusResuleVal=0
  fi

  #判断本子计算对象是否需要stop $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode
  schedulerTaskIsNeedStop "$1" "$2" "$3"

  _checkSubStatusResuleVal=$isStop
  echo "_checkSubStatusResuleVal : $_checkSubStatusResuleVal"
  if [ $isStop -eq 1 ]; then
    echo " $schedulerTaskLogId $calcObjectLogId $subCalcObjectCode [ stop ]"
    #生成子计算对象，设置子计算对象状态为stop
    stopExecSubCalcObject "$1" "$2" "$3" "$4"
    #_checkSubStatusResuleVal=0
    return;
  fi
}

function createDir(){
 if [ !-d $1 ];
 then
  /bin/mkdir -p $1 >/dev/null 2>&1 && echo "Directory $1 created." ||  echo "Error: Failed to create $1 directory."
 else
  /bin/rmdir $1
  /bin/mkdir -p $1 >/dev/null 2>&1 && echo "Directory $1 deleted and then created." ||  echo "Error: Failed to create $1 directory."
 fi
}

#计算昨天日期 date格式是yyyy-MM-dd
function getYesterday(){
   currentDate=$1
   tmpDate=${currentDate//-/}
   timestampDate=`date -d ${tmpDate} +%s`
   timestampResultDate=`expr ${timestampDate} '-' 86400`
   yesterday=`date -d @${timestampResultDate} +%Y-%m-%d`
 }
#计算明天日期 date格式是yyyy-MM-dd
function getTomorrow(){
   currentDate=$1
   tmpDate=${currentDate//-/}
   timestampDate=`date -d ${tmpDate} +%s`
   timestampResultDate=`expr ${timestampDate} '+' 86400`
   tomorrow=`date -d @${timestampResultDate} +%Y-%m-%d`
 }
 
 
