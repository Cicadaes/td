#!/bin/bash

ps -ef|grep  wanalytics-adapter-2.0.jar|grep server.port=7000|grep -v "grep"|awk '{print $2}' |xargs kill

