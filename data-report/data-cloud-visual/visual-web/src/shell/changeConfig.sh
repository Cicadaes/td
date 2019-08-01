#!/bin/bash

jar xvf visual-web.war WEB-INF/lib/visual-core-0.0.1-SNAPSHOT.jar
echo "解压visual-core"
jar uf WEB-INF/lib/visual-core-0.0.1-SNAPSHOT.jar jdbc.properties
echo "替换数据库连接"
jar uf WEB-INF/lib/visual-core-0.0.1-SNAPSHOT.jar redis.properties
echo "替换redis连接"
jar uf ./visual-web.war WEB-INF/lib/visual-core-0.0.1-SNAPSHOT.jar
echo "替换core包"
jar uf ./visual-web.war WEB-INF/classes/um-rmi-client.properties
echo "替换UM"
cd ..
cp changeConfig/visual-web.war webapps/
echo "jetty重启"
kill -9 `lsof -i:9097|awk -F " " '{print $2}'|tail -1`
nohup java -jar start.jar >/dev/null 2>&1 &
echo "启动完成"
