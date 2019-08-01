#!/usr/bin/env bash
#author:xiaolong.chen
#date:2016-04-28
#version:1.0

#parameter
jobname=$1
date=$2
dateinterval=$3
tenantid=$4
projectid=$5
placeid=$6
sensorid=$7
roomid=$8

usage(){
    echo "[-jobName] [-date] [-dateInterval] [-tenantId] [-projectId] [-placeId] [-sensorId] [-roomid]\n" &&
    echo "jobName is required!" &&
    echo "date {yyyy-MM-dd}, default : today." &&
    echo "dateInterval default : 31." &&
    exit 1
}

compute(){
	echo "jobname:[$jobname],date:[$date] ,dateinterval:[$dateinterval] ,tenantid:[$tenantid] ,projectid:[$projectid] ,placeid:[$placeid] ,sensorid:[$sensorid], roomid:[$roomid]." &&
java -cp wanalytics-offline-compute-1.0-SNAPSHOT.jar com.talkingdata.wifianalytics.offline.compute.main.JobMain ${jobname} ${date} ${dateinterval} ${tenantid} ${projectid} ${placeid} ${sensorid} ${roomid}

}

#check parameter
if [[ $# -le 0 ]]; then
	#statements
    usage
elif [[ $# -le 1 ]]; then
    date=$(date +%Y-%m-%d)
    compute
else
	compute
fi